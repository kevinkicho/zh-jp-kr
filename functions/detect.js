const KNOWN = new Set(['en', 'zh_CN', 'zh_TW', 'ja', 'ko']);

function countScript(text, script) {
  const match = String(text).match(new RegExp(`\\p{Script=${script}}`, 'gu'));
  return match ? match.length : 0;
}

export function detectSourceLang(text, fallback = 'zh_CN') {
  const sample = String(text || '');
  const hangul = countScript(sample, 'Hangul');
  const hiragana = countScript(sample, 'Hiragana');
  const katakana = countScript(sample, 'Katakana');
  const han = countScript(sample, 'Han');
  const latin = countScript(sample, 'Latin');
  const kana = hiragana + katakana;
  const safeFallback = KNOWN.has(fallback) ? fallback : 'zh_CN';

  if (hangul > 0 && hangul >= kana && hangul >= latin) return 'ko';
  if (kana > 0 && kana >= latin) return 'ja';
  if (han > 0 && han >= latin) {
    if (safeFallback === 'ja' || safeFallback === 'zh_CN' || safeFallback === 'zh_TW') {
      return safeFallback;
    }
    return 'zh_CN';
  }
  if (latin > 0) return 'en';
  return safeFallback;
}

export function sourceFamily(lang) {
  if (lang === 'zh_CN' || lang === 'zh_TW') return 'zh';
  return lang;
}

export function isHangulHeavy(text) {
  const sample = String(text || '');
  return countScript(sample, 'Hangul') > 0 && countScript(sample, 'Hangul') >= countScript(sample, 'Han');
}

export function isKanaHeavy(text) {
  const sample = String(text || '');
  return countScript(sample, 'Hiragana') + countScript(sample, 'Katakana') > 0;
}
