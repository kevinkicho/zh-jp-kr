const DEFAULT_MODELS = ['gemma4:31b', 'gpt-oss:20b'];
const OLLAMA_CHAT = 'https://ollama.com/api/chat';

const LANG_NAMES = {
  en: 'English',
  zh_CN: 'Simplified Chinese',
  zh_TW: 'Traditional Chinese',
  ja: 'Japanese',
  ko: 'Korean',
};

const FORMAT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'en',
    'zh_simplified',
    'zh_traditional',
    'zh_pinyin',
    'ja',
    'ja_kana',
    'ja_romaji',
    'ko',
    'ko_romanization',
    'ko_hanja',
  ],
  properties: {
    en: { type: 'string' },
    zh_simplified: { type: 'string' },
    zh_traditional: { type: 'string' },
    zh_pinyin: { type: 'string' },
    ja: { type: 'string' },
    ja_kana: { type: 'string' },
    ja_romaji: { type: 'string' },
    ko: { type: 'string' },
    ko_romanization: { type: 'string' },
    ko_hanja: { type: 'string' },
  },
};

const SYSTEM_PROMPT = `You are a precise translator for English, Chinese, Japanese, and Korean.
Reply with JSON only using these keys:
{"en":"","zh_simplified":"","zh_traditional":"","zh_pinyin":"","ja":"","ja_kana":"","ja_romaji":"","ko":"","ko_romanization":"","ko_hanja":""}

Rules:
- Translate natural meaning, never character-by-character and never as pinyin/romanization in the English field.
- Keep the source language as the natural original text.
- Simplified and Traditional Chinese must use the correct script (国/國, 开放/開放, 可持续/永續 is fine).
- Japanese must use the correct established kanji (치외법권 → 治外法権 not 歯外法権; 하위 → 下位/下 not 子).
- Korean 불평등 is social inequality 不平等, not the math term 不等式.
- 一期一会 Korean is 일기일회 (or 일생에 한 번), not a digit gloss like 1기 1회.
- ja_kana is full hiragana; ja_romaji is Hepburn; zh_pinyin is Hanyu Pinyin with tone marks; ko_romanization is Revised Romanization.
- ko_hanja is hanja if a standard form exists, else empty.
- Do not treat ordinary words as personal names unless they are clearly names.`;

function ollamaKey() {
  return String(process.env.OLLAMA_API_KEY || '').trim();
}

export function ollamaEnabled() {
  return Boolean(ollamaKey());
}

function modelList() {
  const preferred = String(process.env.OLLAMA_MODEL || '').trim();
  return [...new Set([preferred, ...DEFAULT_MODELS].filter(Boolean))];
}

function extractJson(text) {
  const trimmed = String(text || '').trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fence ? fence[1].trim() : trimmed;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('Ollama returned no JSON.');
  return JSON.parse(raw.slice(start, end + 1));
}

function pick(obj, ...paths) {
  for (const path of paths) {
    let cur = obj;
    for (const key of path.split('.')) cur = cur?.[key];
    if (typeof cur === 'string' && cur.trim()) return cur.trim();
  }
  return '';
}

function familyOf(sourceLang) {
  return sourceLang === 'zh_CN' || sourceLang === 'zh_TW' ? 'zh' : sourceLang;
}

function normalize(parsed, text, sourceLang) {
  const family = familyOf(sourceLang);
  const en = pick(parsed, 'en', 'en.text', 'gloss') || (family === 'en' ? text : '');
  const result = {
    zh: {
      simplified: pick(parsed, 'zh_simplified', 'zh.simplified') || (family === 'zh' ? text : ''),
      traditional: pick(parsed, 'zh_traditional', 'zh.traditional') || (family === 'zh' ? text : ''),
      pinyin: pick(parsed, 'zh_pinyin', 'zh.pinyin'),
    },
    ja: {
      text: pick(parsed, 'ja', 'ja.text') || (family === 'ja' ? text : ''),
      kana: pick(parsed, 'ja_kana', 'ja.kana'),
      romaji: pick(parsed, 'ja_romaji', 'ja.romaji'),
    },
    ko: {
      text: pick(parsed, 'ko', 'ko.text') || (family === 'ko' ? text : ''),
      romanization: pick(parsed, 'ko_romanization', 'ko.romanization'),
      hanja: pick(parsed, 'ko_hanja', 'ko.hanja'),
      explanation: '',
    },
    en: { text: en },
    gloss: en,
    provider: 'ollama',
    sourceLang,
  };

  if (family === 'en') result.en.text = text;
  if (family === 'ja') result.ja.text = text;
  if (family === 'ko') result.ko.text = text;
  return result;
}

function looksComplete(result) {
  return Boolean(
    result?.en?.text &&
      result?.zh?.simplified &&
      result?.zh?.traditional &&
      result?.ja?.text &&
      result?.ko?.text
  );
}

async function chatOnce(model, text, sourceLang) {
  const response = await fetch(OLLAMA_CHAT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ollamaKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      stream: false,
      format: FORMAT_SCHEMA,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Source language: ${LANG_NAMES[sourceLang] || sourceLang}\nText: ${text}`,
        },
      ],
    }),
    signal: AbortSignal.timeout(22000),
  });
  const raw = await response.text();
  if (response.status === 403 || response.status === 404) {
    const error = new Error(`Ollama ${response.status}`);
    error.retryable = true;
    throw error;
  }
  if (!response.ok) {
    throw new Error(`Ollama HTTP ${response.status}: ${raw.slice(0, 180)}`);
  }
  const data = JSON.parse(raw);
  const content = data?.message?.content;
  if (!content) throw new Error('Empty Ollama response.');
  return normalize(extractJson(content), text, sourceLang);
}

export async function translateWithOllama({ text, sourceLang }) {
  if (!ollamaEnabled()) return null;
  const source = String(text || '').trim();
  if (!source) return null;

  let lastError = 'Ollama translation failed.';
  for (const model of modelList()) {
    try {
      const result = await chatOnce(model, source, sourceLang);
      if (looksComplete(result)) {
        result.provider = `ollama:${model}`;
        return result;
      }
      lastError = `Incomplete Ollama payload from ${model}`;
    } catch (error) {
      lastError = error.message || lastError;
      if (!error.retryable) throw new Error(lastError);
    }
  }
  throw new Error(lastError);
}
