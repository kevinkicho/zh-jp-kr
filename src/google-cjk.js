import { detectSourceLang } from './detect.js';

const LANG_IDS = new Set(['en', 'zh_CN', 'zh_TW', 'ja', 'ko']);
const GTX_LANG = {
  en: 'en',
  zh_CN: 'zh-CN',
  zh_TW: 'zh-TW',
  ja: 'ja',
  ko: 'ko',
};

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

const GOOGLE_LANG = {
  en: ['en'],
  zh_CN: ['zh_CN', 'zh'],
  zh_TW: ['zh_TW', 'zh-Hant'],
  ja: ['ja'],
  ko: ['ko'],
};

const ITC = {
  en: 'en-t-i0-handwrit',
  zh_CN: 'zh-t-i0-handwrit',
  zh_TW: 'zh-hant-t-i0-handwrit',
  ja: 'ja-t-i0-handwrit',
  ko: 'ko-t-i0-handwrit',
};

export async function recognizeDirect({ ink, width, height, language, preContext }) {
  if (!Array.isArray(ink) || ink.length === 0) {
    throw new Error('Draw something first.');
  }
  const lang = LANG_IDS.has(language) ? language : 'ja';
  const areaW = Math.max(1, Math.round(width) || 400);
  const areaH = Math.max(1, Math.round(height) || 400);
  const googleLangs = GOOGLE_LANG[lang] || [lang];

  const imeUrls = [
    'https://www.google.com/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8',
    'https://inputtools.google.com/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8',
  ];

  let lastError = 'Recognition failed.';

  for (const gLang of googleLangs) {
    const payload = {
      options: 'enable_pre_space',
      requests: [
        {
          writing_guide: {
            writing_area_width: areaW,
            writing_area_height: areaH,
          },
          ink,
          language: gLang,
          max_num_results: 12,
        },
      ],
    };
    if (preContext) payload.requests[0].pre_context = String(preContext).slice(-40);

    for (const url of imeUrls) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          lastError = `Recognition HTTP ${response.status}`;
          continue;
        }
        const candidates = parseGoogleCandidates(await response.json());
        if (candidates.length) return { candidates };
      } catch (error) {
        lastError = error.message || lastError;
      }
    }
  }

  try {
    const itc = ITC[lang] || ITC.ja;
    const response = await fetch(
      `https://inputtools.google.com/request?itc=${itc}&app=demopage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([lang, ink, {}]),
      }
    );
    if (response.ok) {
      const candidates = parseGoogleCandidates(await response.json());
      if (candidates.length) return { candidates };
    }
  } catch (error) {
    lastError = error.message || lastError;
  }

  throw new Error(lastError);
}

function countScript(text, script) {
  const match = String(text).match(new RegExp(`\\p{Script=${script}}`, 'gu'));
  return match ? match.length : 0;
}

function normalized(text) {
  return String(text || '').replace(/\s+/g, '').toLowerCase();
}

function looksUntranslated(source, translated, sourceLang, targetFamily) {
  if (!translated) return true;
  const family = sourceLang === 'zh_CN' || sourceLang === 'zh_TW' ? 'zh' : sourceLang;
  if (family === targetFamily) return false;
  if (normalized(source) !== normalized(translated)) return false;
  if (countScript(source, 'Hangul') > 0 && targetFamily !== 'ko') return true;
  if (countScript(source, 'Hiragana') + countScript(source, 'Katakana') > 0 && targetFamily !== 'ja') {
    return true;
  }
  if (countScript(source, 'Latin') > 0 && targetFamily !== 'en') return true;
  return false;
}

function parseGtx(data) {
  const rows = Array.isArray(data?.[0]) ? data[0] : [];
  const translated = rows.map((part) => (part && part[0] ? part[0] : '')).join('');
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

export async function translateDirect({ text, language }) {
  const source = String(text || '').trim();
  if (!source) throw new Error('Nothing to translate.');
  const sourceLang = detectSourceLang(source, LANG_IDS.has(language) ? language : 'zh_CN');
  const sl = GTX_LANG[sourceLang] || 'auto';
  let result = await translateWithSl(source, sl, sourceLang);
  const failed =
    looksUntranslated(source, result.zh.simplified, sourceLang, 'zh') ||
    looksUntranslated(source, result.ja.text, sourceLang, 'ja') ||
    looksUntranslated(source, result.ko.text, sourceLang, 'ko') ||
    looksUntranslated(source, result.en?.text, sourceLang, 'en');
  if (failed && sl !== 'auto') {
    result = await translateWithSl(source, 'auto', sourceLang);
  }
  return result;
}
