import { recognizeDirect, translateDirect } from './google-cjk.js';

export const LANGS = [
  {
    id: 'en',
    htmlLang: 'en',
    short: 'EN',
    name: 'English',
    tts: 'en-US',
    hint: 'Draw or type in English',
    placeholder: 'Draw or type…',
  },
  {
    id: 'zh_CN',
    htmlLang: 'zh-CN',
    short: '简',
    name: '简体中文',
    tts: 'zh-CN',
    hint: '用手指写一个字',
    placeholder: '手写或输入…',
  },
  {
    id: 'zh_TW',
    htmlLang: 'zh-TW',
    short: '繁',
    name: '繁體中文',
    tts: 'zh-TW',
    hint: '用手指寫一個字',
    placeholder: '手寫或輸入…',
  },
  {
    id: 'ja',
    htmlLang: 'ja',
    short: '日',
    name: '日本語',
    tts: 'ja-JP',
    hint: '指で文字を書いてください',
    placeholder: '書いて入力…',
  },
  {
    id: 'ko',
    htmlLang: 'ko',
    short: '한',
    name: '한국어',
    tts: 'ko-KR',
    hint: '손가락으로 글자를 쓰세요',
    placeholder: '쓰거나 입력…',
  },
];

export function langById(id) {
  return LANGS.find((item) => item.id === id) || LANGS[0];
}

export { detectSourceLang, sourceFamily } from './detect.js';

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const type = response.headers.get('content-type') || '';
  if (!type.includes('application/json')) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }
  return data;
}

export async function recognize(payload) {
  try {
    const data = await postJson('/api/recognize', payload);
    if (Array.isArray(data?.candidates) && data.candidates.length) return data;
  } catch {
    // Fall through to a direct Google call when /api is HTML or empty.
  }
  return recognizeDirect(payload);
}

export async function translate(payload) {
  try {
    const data = await postJson('/api/translate', payload);
    if (data?.zh || data?.ja || data?.ko) return data;
  } catch {
    // Fall through to a direct Google call when /api is HTML or empty.
  }
  return translateDirect(payload);
}

export function speak(text, lang) {
  if (!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find((voice) => voice.lang === lang)
    || voices.find((voice) => voice.lang.startsWith(lang.slice(0, 2)));
  if (match) utterance.voice = match;
  window.speechSynthesis.speak(utterance);
}

export async function copyText(text) {
  if (!text) return;
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const field = document.createElement('textarea');
  field.value = text;
  document.body.appendChild(field);
  field.select();
  document.execCommand('copy');
  field.remove();
}
