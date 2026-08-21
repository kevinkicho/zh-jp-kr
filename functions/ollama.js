const DEFAULT_MODELS = ['gpt-oss:120b', 'gemma4:31b', 'gpt-oss:20b'];
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

const SYSTEM_PROMPT = `You are a professional translator for English, Chinese, Japanese, and Korean.
Return JSON only with keys:
{"en":"","zh_simplified":"","zh_traditional":"","zh_pinyin":"","ja":"","ja_kana":"","ja_romaji":"","ko":"","ko_romanization":"","ko_hanja":""}

Translate the user's exact writing.
- Honor spelling, not pronunciation. Same reading + different characters = different words.
- Kanji/hanzi in the source are binding, including when mixed with kana (okurigana). Translate that written word, not a kana-only homophone.
- Keep the source language as the original text.
- Use natural established equivalents, not a character-by-character calque, unless the source is a name.
- English is a meaning, never pinyin or romanization.
- Use correct Simplified vs Traditional Chinese.
- ja_kana = hiragana; ja_romaji = Hepburn; zh_pinyin = Hanyu Pinyin with tones; ko_romanization = Revised Romanization.
- ko_hanja only if a standard hanja form exists.`;

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

async function chatOnce(model, messages) {
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
      options: { temperature: 0 },
      messages,
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
  return extractJson(content);
}

function userTranslatePrompt(text, sourceLang) {
  return [
    `Source language: ${LANG_NAMES[sourceLang] || sourceLang}`,
    `Text: ${text}`,
    'Translate this exact writing into all target fields.',
  ].join('\n');
}

export async function translateWithOllama({ text, sourceLang }) {
  if (!ollamaEnabled()) return null;
  const source = String(text || '').trim();
  if (!source) return null;

  let lastError = 'Ollama translation failed.';
  for (const model of modelList()) {
    try {
      const parsed = await chatOnce(model, [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userTranslatePrompt(source, sourceLang) },
      ]);
      const result = normalize(parsed, source, sourceLang);
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
