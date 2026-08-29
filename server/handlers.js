import { detectSourceLang } from '../src/detect.js';
import { ollamaEnabled, translateWithOllama } from '../functions/ollama.js';
import { firebaseReady } from './firebase.js';


export function publicFirebaseConfig() {
  const apiKey = process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_WEB_API_KEY || '';
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || '';
  if (!apiKey || !projectId) return null;
  return {
    apiKey,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || '',
    databaseURL: process.env.VITE_FIREBASE_DATABASE_URL || process.env.FIREBASE_DATABASE_URL || '',
  };
}

export function firebaseConfigHandler(_req, res) {
  const config = publicFirebaseConfig();
  if (!config) {
    res.status(404).json({ error: 'Firebase web config is not set.' });
    return;
  }
  res.setHeader('Cache-Control', 'no-store');
  res.json(config);
}

const LANG_NAMES = {
  en: 'English',
  zh_CN: 'Simplified Chinese',
  zh_TW: 'Traditional Chinese',
  ja: 'Japanese',
  ko: 'Korean',
};

const GTX_LANG = {
  en: 'en',
  zh_CN: 'zh-CN',
  zh_TW: 'zh-TW',
  ja: 'ja',
  ko: 'ko',
};

const translationCache = new Map();

function countScript(text, script) {
  const match = String(text).match(new RegExp(`\\p{Script=${script}}`, 'gu'));
  return match ? match.length : 0;
}

function normalized(text) {
  return String(text || '').replace(/\s+/g, '').toLowerCase();
}

function looksUntranslated(source, translated, sourceLang, targetFamily) {
  if (!translated) return true;
  const sourceFamily = sourceLang === 'zh_CN' || sourceLang === 'zh_TW' ? 'zh' : sourceLang;
  if (sourceFamily === targetFamily) return false;
  if (normalized(source) !== normalized(translated)) return false;
  if (countScript(source, 'Hangul') > 0 && targetFamily !== 'ko') return true;
  if (countScript(source, 'Hiragana') + countScript(source, 'Katakana') > 0 && targetFamily !== 'ja') {
    return true;
  }
  if (countScript(source, 'Latin') > 0 && targetFamily !== 'en') return true;
  return false;
}

function parseGoogleCandidates(data) {
  const row = Array.isArray(data) ? data[1]?.[0] : null;
  if (Array.isArray(row)) {
    const lists = row.filter(
      (item) => Array.isArray(item) && item.some((value) => typeof value === 'string' && value.trim())
    );
    const best = lists.sort((a, b) => b.length - a.length)[0];
    if (best) {
      return best.filter((item) => typeof item === 'string' && item.trim()).slice(0, 12);
    }
  }
  throw new Error('Unexpected handwriting response');
}

async function postJson(url, body, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await response.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
    return { ok: response.ok, status: response.status, json, text };
  } finally {
    clearTimeout(timer);
  }
}

export async function recognizeHandler(req, res) {
  try {
    const { ink, width, height, language, preContext } = req.body || {};
    if (!Array.isArray(ink) || ink.length === 0) {
      return res.status(400).json({ error: 'Draw something first.' });
    }

    const lang = LANG_NAMES[language] ? language : 'ja';
    const payload = {
      options: 'enable_pre_space',
      requests: [
        {
          writing_guide: {
            writing_area_width: Math.round(width) || 400,
            writing_area_height: Math.round(height) || 400,
          },
          ink,
          language: lang,
          max_num_results: 12,
        },
      ],
    };
    if (preContext) payload.requests[0].pre_context = String(preContext).slice(-40);

    const endpoints = [
      'https://www.google.com/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8',
      'https://inputtools.google.com/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8',
    ];

    let lastError = 'Recognition failed.';
    for (const url of endpoints) {
      try {
        const result = await postJson(url, payload, 12000);
        if (!result.ok || !result.json) {
          lastError = `Recognition HTTP ${result.status}`;
          continue;
        }
        const candidates = parseGoogleCandidates(result.json);
        return res.json({ candidates: candidates.slice(0, 12) });
      } catch (error) {
        lastError = error.message || lastError;
      }
    }

    return res.status(502).json({ error: lastError });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Recognition failed.' });
  }
}

function emptyTranslation(text, sourceLang) {
  const family = sourceLang === 'zh_CN' || sourceLang === 'zh_TW' ? 'zh' : sourceLang;
  return {
    zh: {
      simplified: family === 'zh' ? text : '',
      traditional: family === 'zh' ? text : '',
      pinyin: '',
    },
    ja: { text: family === 'ja' ? text : '', kana: '', romaji: '' },
    ko: { text: family === 'ko' ? text : '', romanization: '', hanja: '', explanation: '' },
    en: { text: family === 'en' ? text : '' },
    gloss: '',
    provider: 'none',
    sourceLang,
  };
}

function parseGtx(data) {
  const rows = Array.isArray(data?.[0]) ? data[0] : [];
  const translated = rows
    .map((part) => (part && part[0] ? part[0] : ''))
    .join('');
  const romanization = rows
    .map((part) => (part && part[3] ? part[3] : ''))
    .filter(Boolean)
    .join(' ');
  return { text: translated, romanization };
}

async function gtx(text, sl, tl) {
  if (sl !== 'auto' && sl === tl) return { text, romanization: '' };
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&dt=rm&q=${encodeURIComponent(text)}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`Translate HTTP ${response.status}`);
  return parseGtx(await response.json());
}

async function translateWithSl(text, sl, sourceLang) {
  const [zhHans, zhHant, ja, ko, gloss] = await Promise.all([
    gtx(text, sl, 'zh-CN'),
    gtx(text, sl, 'zh-TW'),
    gtx(text, sl, 'ja'),
    gtx(text, sl, 'ko'),
    gtx(text, sl, 'en'),
  ]);

  const zhSimplified = zhHans.text || '';
  const zhTraditional = zhHant.text || '';
  const jaText = ja.text || '';
  const koText = ko.text || '';

  const [pinyin, romaji, hangulRom] = await Promise.all([
    zhSimplified ? gtx(zhSimplified, 'zh-CN', 'en') : Promise.resolve({ romanization: '' }),
    jaText ? gtx(jaText, 'ja', 'en') : Promise.resolve({ romanization: '' }),
    koText ? gtx(koText, 'ko', 'en') : Promise.resolve({ romanization: '' }),
  ]);

  const family = sourceLang === 'zh_CN' || sourceLang === 'zh_TW' ? 'zh' : sourceLang;
  let simplified = zhSimplified || (family === 'zh' ? text : '');
  let traditional = zhTraditional || (family === 'zh' ? text : '');
  if (/\p{Script=Han}/u.test(simplified || traditional)) {
    const seed = simplified || traditional;
    const [hans, hant] = await Promise.all([
      gtx(seed, 'zh-TW', 'zh-CN'),
      gtx(seed, 'zh-CN', 'zh-TW'),
    ]);
    if (hans.text) simplified = hans.text;
    if (hant.text) traditional = hant.text;
  }

  return {
    zh: {
      simplified,
      traditional,
      pinyin: pinyin.romanization || '',
    },
    ja: {
      text: family === 'ja' && !jaText ? text : jaText,
      kana: '',
      romaji: romaji.romanization || '',
    },
    ko: {
      text: family === 'ko' && !koText ? text : koText,
      romanization: hangulRom.romanization || '',
      hanja: '',
      explanation: gloss.text || '',
    },
    en: {
      text: family === 'en' && !gloss.text ? text : gloss.text || '',
    },
    gloss: gloss.text || '',
    provider: sl === 'auto' ? 'gtx-auto' : 'gtx',
    sourceLang,
  };
}

async function translateFallback(text, sourceLang) {
  const sl = GTX_LANG[sourceLang] || 'auto';
  let result = await translateWithSl(text, sl, sourceLang);
  const failed =
    looksUntranslated(text, result.zh.simplified, sourceLang, 'zh') ||
    looksUntranslated(text, result.ja.text, sourceLang, 'ja') ||
    looksUntranslated(text, result.ko.text, sourceLang, 'ko');
  if (failed && sl !== 'auto') {
    result = await translateWithSl(text, 'auto', sourceLang);
  }
  return result;
}

export async function translateHandler(req, res) {
  try {
    const text = String(req.body?.text || '').trim();
    const requested = LANG_NAMES[req.body?.language] ? req.body.language : 'zh_CN';
    if (!text) return res.status(400).json({ error: 'Nothing to translate.' });
    const language = detectSourceLang(text, requested);

    const cacheKey = `${language}:${text}`;
    if (translationCache.has(cacheKey)) {
      return res.json(translationCache.get(cacheKey));
    }

    let result = null;
    try {
      result = await translateWithOllama({ text, sourceLang: language });
    } catch (error) {
      console.error('Ollama translation failed, using Google fallback:', error.message);
    }

    if (!result) {
      try {
        result = await translateFallback(text, language);
      } catch (error) {
        console.error('Fallback translation failed:', error.message);
        result = emptyTranslation(text, language);
      }
    }

    if (translationCache.size > 200) translationCache.clear();
    translationCache.set(cacheKey, result);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Translation failed.' });
  }
}

export function healthHandler(_req, res) {
  res.json({
    ok: true,
    hasOllama: ollamaEnabled(),
    hasXai: Boolean(process.env.XAI_API_KEY),
    firebase: firebaseReady(),
  });
}
