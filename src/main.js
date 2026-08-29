import './style.css';
import { InkPad } from './canvas.js';
import { copyText, detectSourceLang, langById, recognize, speak, translate } from './api.js';
import {
  deleteHistory,
  firebaseEnabled,
  initFirebase,
  loadHistoryPage,
  saveHistory,
  savePrefs,
  signInWithGoogle,
  signOut,
  watchAuth,
  watchPrefs,
} from './firebase.js';

import { createNotesController } from './notes-ui.js';

const appEl = document.getElementById('app');
const pad = new InkPad(document.getElementById('ink'));
const phraseEl = document.getElementById('phrase');
const hintEl = document.getElementById('hint');
const statusEl = document.getElementById('status');
const candidatesEl = document.getElementById('candidates');
const resultsEl = document.getElementById('results');
const accountBtn = document.getElementById('account');
const accountPhoto = document.getElementById('account-photo');
const accountLabel = document.getElementById('account-label');
const backdropEl = document.getElementById('sheet-backdrop');
const menuSheet = document.getElementById('menu-sheet');
const historySheet = document.getElementById('history-sheet');
const settingsSheet = document.getElementById('settings-sheet');
const cardSheet = document.getElementById('card-sheet');
const cardSheetTitle = document.getElementById('card-sheet-title');
const cardSheetBody = document.getElementById('card-sheet-body');
const cardSheetText = document.getElementById('card-sheet-text');
const cardSheetReading = document.getElementById('card-sheet-reading');
const historyListEl = document.getElementById('history-list');
const historyToolsEl = document.getElementById('history-tools');
const historySearchEl = document.getElementById('history-search');
const historyLangEl = document.getElementById('history-lang');
const historySortEl = document.getElementById('history-sort');
const settingLayoutEl = document.getElementById('setting-layout');
const settingHistoryEl = document.getElementById('setting-history');
const settingSpeakEl = document.getElementById('setting-speak');
const settingCardSortEl = document.getElementById('setting-card-sort');

let language = localStorage.getItem('sanpitsu-lang') || 'zh_CN';
if (!langById(language).id || language !== langById(language).id) language = 'zh_CN';
let layout = localStorage.getItem('sanpitsu-layout') === 'stack' ? 'stack' : 'grid';

let candidates = [];
let recognizeTimer = 0;
let recognizeSeq = 0;
let translateSeq = 0;
let lastTranslated = '';
let user = null;
let applyingRemotePrefs = false;
let lastSavedHistory = '';
let historyItems = [];
let historyCursor = null;
let historyDone = false;
let historyLoading = false;
let historySearch = '';
let historyLang = '';
let historySort = 'newest';
let historySearchTimer = 0;
const HISTORY_PAGE = 20;
let saveHistoryEnabled = localStorage.getItem('sanpitsu-save-history') !== '0';
let speakAfterTranslate = localStorage.getItem('sanpitsu-speak') === '1';
let cardSort = localStorage.getItem('sanpitsu-card-sort') === 'oldest' ? 'oldest' : 'newest';
let appMode = localStorage.getItem('sanpitsu-mode') === 'notes' ? 'notes' : 'dictionary';
let notes = null;

function currentLang() {
  return langById(language);
}

function setStatus(message) {
  statusEl.hidden = !message;
  statusEl.textContent = message || '';
}

function applyLanguage() {
  const lang = currentLang();
  phraseEl.lang = lang.htmlLang;
  phraseEl.placeholder = lang.placeholder;
  hintEl.textContent = lang.hint;
  const langSelect = document.getElementById('lang-select');
  if (langSelect && langSelect.value !== language) langSelect.value = language;
  localStorage.setItem('sanpitsu-lang', language);
  persistPrefs();
}

function persistPrefs() {
  if (user && !applyingRemotePrefs) {
    savePrefs(user.uid, {
      language,
      layout,
      saveHistory: saveHistoryEnabled,
      speakAfterTranslate,
      cardSort,
    }).catch(() => {});
  }
}

function applyLayout() {
  appEl.classList.toggle('layout-stack', layout === 'stack');
  document.querySelectorAll('.layouts button').forEach((button) => {
    button.setAttribute('aria-selected', String(button.dataset.layout === layout));
  });
  localStorage.setItem('sanpitsu-layout', layout);
  persistPrefs();
}

function syncLayoutChrome() {
  const width = window.innerWidth;
  appEl.classList.toggle('layout-tablet', width >= 720 && width < 1024);
  appEl.classList.toggle('layout-split', width >= 1024);
}

function updateHint() {
  hintEl.classList.toggle('hidden', pad.hasInk());
}

function renderCandidates() {
  candidatesEl.innerHTML = candidates
    .map(
      (item, index) =>
        `<button type="button" class="candidate${index === 0 ? ' top' : ''}" data-index="${index}">${escapeHtml(item)}</button>`
    )
    .join('');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function appendText(value) {
  phraseEl.value = `${phraseEl.value}${value}`;
  pad.clear();
  candidates = [];
  renderCandidates();
  updateHint();
}

async function runRecognize() {
  if (!pad.hasInk()) return;
  const seq = ++recognizeSeq;
  setStatus('Recognizing…');
  try {
    const { width, height } = pad.cssSize();
    const data = await recognize({
      ink: pad.toInk(),
      width,
      height,
      language,
      preContext: phraseEl.value,
    });
    if (seq !== recognizeSeq) return;
    candidates = data.candidates || [];
    renderCandidates();
    setStatus(candidates.length ? '' : 'No match. Try again.');
  } catch (error) {
    if (seq !== recognizeSeq) return;
    setStatus(error.message || 'Recognition failed.');
  }
}

function queueRecognize() {
  clearTimeout(recognizeTimer);
  recognizeTimer = window.setTimeout(runRecognize, 380);
}

function activeSourceLang(text, apiLang) {
  return detectSourceLang(text, apiLang || language);
}

function syncLangFromText() {
  const text = phraseEl.value.trim();
  if (!text) return;
  const detected = detectSourceLang(text, language);
  if (detected === language) return;
  language = detected;
  applyLanguage();
}

function setDisplay(el, value) {
  if (!el) return;
  el.textContent = '';
  if (value) el.dataset.display = value;
  else delete el.dataset.display;
}

function fillCard(key, { text, reading, explain, speakLang, isSource }) {
  const card = resultsEl.querySelector(`[data-key="${key}"]`);
  if (!card) return;
  card.classList.toggle('source', Boolean(isSource && text));
  card.dataset.text = text;
  card.dataset.lang = speakLang;
  card.lang = speakLang;
  card.setAttribute('aria-label', text || langById(key).name);
  setDisplay(card.querySelector('.text'), text);
  const readingEl = card.querySelector('.reading');
  setDisplay(readingEl, reading);
  readingEl.hidden = !reading;
  const explainEl = card.querySelector('.explain');
  if (explainEl) {
    setDisplay(explainEl, explain || '');
    explainEl.hidden = !explain;
  }
  const expand = card.querySelector('.card-expand');
  if (expand) expand.hidden = !text;
}

function renderResults(data) {
  const original = phraseEl.value.trim();
  if (!data || !original) {
    fillCard('en', { text: '', reading: '', explain: '', speakLang: 'en-US', isSource: false });
    fillCard('zh_CN', { text: '', reading: '', explain: '', speakLang: 'zh-CN', isSource: false });
    fillCard('zh_TW', { text: '', reading: '', explain: '', speakLang: 'zh-TW', isSource: false });
    fillCard('ko', { text: '', reading: '', explain: '', speakLang: 'ko-KR', isSource: false });
    fillCard('ja', { text: '', reading: '', explain: '', speakLang: 'ja-JP', isSource: false });
    return;
  }

  const fromLang = activeSourceLang(original, data.sourceLang);
  const simplified = data.zh?.simplified || (fromLang === 'zh_CN' || fromLang === 'zh_TW' ? original : '');
  const traditional = data.zh?.traditional || (fromLang === 'zh_TW' ? original : '');
  const jaText = fromLang === 'ja' ? original : data.ja?.text || '';
  const koText = fromLang === 'ko' ? original : data.ko?.text || '';
  const enText = fromLang === 'en' ? original : data.en?.text || data.gloss || '';

  fillCard('en', {
    text: enText,
    reading: fromLang === 'en' ? '' : data.gloss && data.gloss !== enText ? data.gloss : '',
    speakLang: 'en-US',
    isSource: fromLang === 'en',
  });
  fillCard('zh_CN', {
    text: simplified,
    reading: data.zh?.pinyin || '',
    speakLang: 'zh-CN',
    isSource: fromLang === 'zh_CN',
  });
  fillCard('zh_TW', {
    text: traditional,
    reading: data.zh?.pinyin || '',
    speakLang: 'zh-TW',
    isSource: fromLang === 'zh_TW',
  });
  fillCard('ko', {
    text: koText,
    reading: [
      data.ko?.romanization,
      data.ko?.hanja || '',
    ]
      .filter(Boolean)
      .join('  '),
    speakLang: 'ko-KR',
    isSource: fromLang === 'ko',
  });
  fillCard('ja', {
    text: jaText,
    reading: [data.ja?.kana, data.ja?.romaji].filter(Boolean).join('  '),
    speakLang: 'ja-JP',
    isSource: fromLang === 'ja',
  });
}

async function runTranslate() {
  const text = phraseEl.value.trim();
  if (!text) {
    lastTranslated = '';
    renderResults(null);
    return;
  }
  const stamp = `${language}:${text}`;
  if (stamp === lastTranslated) return;
  const seq = ++translateSeq;
  setStatus('Translating…');
  try {
    const data = await translate({ text, language });
    if (seq !== translateSeq) return;
    lastTranslated = stamp;
    renderResults(data);
    setStatus('');
    persistHistory(text, data);
    if (speakAfterTranslate) {
      const fromLang = activeSourceLang(text, data.sourceLang);
      const tts =
        fromLang === 'en'
          ? 'en-US'
          : fromLang === 'ko'
            ? 'ko-KR'
            : fromLang === 'ja'
              ? 'ja-JP'
              : fromLang === 'zh_TW'
                ? 'zh-TW'
                : 'zh-CN';
      speak(text, tts);
    }
  } catch (error) {
    if (seq !== translateSeq) return;
    setStatus(error.message || 'Translation failed.');
  }
}

document.querySelector('.layouts').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-layout]');
  if (!button || button.dataset.layout === layout) return;
  layout = button.dataset.layout === 'stack' ? 'stack' : 'grid';
  applyLayout();
});

document.getElementById('lang-select').addEventListener('change', (event) => {
  language = event.target.value;
  applyLanguage();
  if (pad.hasInk()) queueRecognize();
});

candidatesEl.addEventListener('click', (event) => {
  const button = event.target.closest('.candidate');
  if (!button) return;
  const value = candidates[Number(button.dataset.index)];
  if (appMode === 'notes' && notes?.isEditing()) {
    notes.insertAtCaret(value);
    return;
  }
  appendText(value);
});

let cardPressTimer = 0;
let cardLongPress = false;
let cardPointer = { x: 0, y: 0 };

function cardPointerMoved(event) {
  return Math.hypot(event.clientX - cardPointer.x, event.clientY - cardPointer.y) > 10;
}

function suppressBrowserTextGestures(event) {
  event.preventDefault();
  event.stopPropagation();
  window.getSelection?.()?.removeAllRanges();
}

resultsEl.addEventListener(
  'touchstart',
  (event) => {
    if (event.target.closest('.card-expand')) return;
    if (event.target.closest('.card')?.dataset.text) suppressBrowserTextGestures(event);
  },
  { passive: false }
);
resultsEl.addEventListener('selectstart', (event) => {
  if (event.target.closest('.card')) event.preventDefault();
});
resultsEl.addEventListener('dragstart', (event) => {
  if (event.target.closest('.card')) event.preventDefault();
});

resultsEl.addEventListener(
  'pointerdown',
  (event) => {
    if (event.target.closest('.card-expand')) return;
    const card = event.target.closest('.card');
    if (!card?.dataset.text) return;
    suppressBrowserTextGestures(event);
    cardLongPress = false;
    cardPointer = { x: event.clientX, y: event.clientY };
    clearTimeout(cardPressTimer);
    cardPressTimer = window.setTimeout(async () => {
      cardLongPress = true;
      await copyText(card.dataset.text);
      setStatus('Copied');
      setTimeout(() => setStatus(''), 800);
    }, 480);
  },
  { passive: false }
);

resultsEl.addEventListener('pointermove', (event) => {
  if (!cardPressTimer) return;
  if (cardPointerMoved(event)) clearTimeout(cardPressTimer);
});

resultsEl.addEventListener('pointerup', (event) => {
  clearTimeout(cardPressTimer);
  if (event.target.closest('.card-expand')) return;
  const card = event.target.closest('.card');
  if (!card?.dataset.text || cardLongPress) return;
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  if (cardPointerMoved(event)) return;
  window.getSelection?.()?.removeAllRanges();
  speak(card.dataset.text, card.dataset.lang);
});

resultsEl.addEventListener('pointercancel', () => {
  clearTimeout(cardPressTimer);
});

resultsEl.addEventListener('pointerleave', (event) => {
  if (event.target === resultsEl) clearTimeout(cardPressTimer);
});

resultsEl.addEventListener('click', (event) => {
  const expand = event.target.closest('.card-expand');
  if (expand) {
    event.preventDefault();
    event.stopPropagation();
    openCardSheet(expand.closest('.card'));
    return;
  }
  if (event.target.closest('.card')) event.preventDefault();
});

let sheetPressTimer = 0;
let sheetLongPress = false;
let sheetPointer = { x: 0, y: 0 };

cardSheetBody.addEventListener(
  'touchstart',
  (event) => {
    if (cardSheetBody.dataset.text) suppressBrowserTextGestures(event);
  },
  { passive: false }
);
cardSheetBody.addEventListener('selectstart', (event) => event.preventDefault());
cardSheetBody.addEventListener(
  'pointerdown',
  (event) => {
    if (!cardSheetBody.dataset.text) return;
    suppressBrowserTextGestures(event);
    sheetLongPress = false;
    sheetPointer = { x: event.clientX, y: event.clientY };
    clearTimeout(sheetPressTimer);
    sheetPressTimer = window.setTimeout(async () => {
      sheetLongPress = true;
      await copyText(cardSheetBody.dataset.text);
      setStatus('Copied');
      setTimeout(() => setStatus(''), 800);
    }, 480);
  },
  { passive: false }
);
cardSheetBody.addEventListener('pointermove', (event) => {
  if (!sheetPressTimer) return;
  if (Math.hypot(event.clientX - sheetPointer.x, event.clientY - sheetPointer.y) > 10) {
    clearTimeout(sheetPressTimer);
  }
});
cardSheetBody.addEventListener('pointerup', (event) => {
  clearTimeout(sheetPressTimer);
  if (!cardSheetBody.dataset.text || sheetLongPress) return;
  if (Math.hypot(event.clientX - sheetPointer.x, event.clientY - sheetPointer.y) > 10) return;
  speak(cardSheetBody.dataset.text, cardSheetBody.dataset.lang);
});
cardSheetBody.addEventListener('pointercancel', () => clearTimeout(sheetPressTimer));
cardSheetBody.addEventListener('contextmenu', (event) => event.preventDefault());

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !backdropEl.hidden) closeSheets();
});

resultsEl.addEventListener('contextmenu', (event) => {
  if (event.target.closest('.card')) event.preventDefault();
});

document.getElementById('undo').addEventListener('click', () => {
  pad.undo();
  updateHint();
  if (pad.hasInk()) queueRecognize();
  else {
    candidates = [];
    renderCandidates();
    setStatus('');
  }
});

document.getElementById('clear').addEventListener('click', () => {
  pad.clear();
  candidates = [];
  renderCandidates();
  updateHint();
  setStatus('');
});

document.getElementById('accept').addEventListener('click', () => {
  if (appMode === 'notes' && notes?.isEditing()) {
    if (candidates[0]) notes.insertAtCaret(candidates[0]);
    else if (phraseEl.value.trim()) notes.insertFromComposer();
    else if (pad.hasInk()) runRecognize();
    return;
  }
  if (candidates[0]) appendText(candidates[0]);
  else if (pad.hasInk()) {
    runRecognize();
    return;
  }
  if (phraseEl.value.trim()) runTranslate();
});

document.getElementById('backspace').addEventListener('click', () => {
  phraseEl.value = [...phraseEl.value].slice(0, -1).join('');
  if (!phraseEl.value.trim()) {
    lastTranslated = '';
    renderResults(null);
  }
});

document.getElementById('clear-text').addEventListener('click', () => {
  phraseEl.value = '';
  lastTranslated = '';
  renderResults(null);
  setStatus('');
});

const keyboardTrap = document.getElementById('keyboard-trap');

function hideKeyboard() {
  phraseEl.readOnly = true;
  phraseEl.setAttribute('inputmode', 'none');
  phraseEl.blur();
  if (keyboardTrap) {
    keyboardTrap.focus({ preventScroll: true });
    keyboardTrap.blur();
  }
  if (document.activeElement && document.activeElement !== document.body) {
    document.activeElement.blur();
  }
  window.scrollTo(0, 0);
  window.setTimeout(() => {
    phraseEl.readOnly = false;
    phraseEl.setAttribute('inputmode', 'search');
  }, 120);
}

function submitPhrase(event) {
  event?.preventDefault();
  hideKeyboard();
  if (appMode === 'notes') {
    notes?.insertFromComposer();
    return;
  }
  runTranslate();
}

function isPhraseSubmitKey(event) {
  return event.key === 'Enter' || event.key === 'Go' || event.key === 'Done' || event.key === 'Search';
}

phraseEl.addEventListener('input', (event) => {
  if (!event.isComposing) syncLangFromText();
});
phraseEl.addEventListener('compositionend', () => {
  syncLangFromText();
});
phraseEl.addEventListener('keydown', (event) => {
  if (!isPhraseSubmitKey(event)) return;
  if (event.isComposing) return;
  submitPhrase(event);
});
phraseEl.addEventListener('keyup', (event) => {
  if (!isPhraseSubmitKey(event) || event.isComposing) return;
  hideKeyboard();
});
phraseEl.addEventListener('search', submitPhrase);
document.getElementById('phrase-form').addEventListener('submit', submitPhrase);

let pointerInComposerChrome = false;
appEl.addEventListener(
  'pointerdown',
  (event) => {
    pointerInComposerChrome = Boolean(
      event.target.closest('#phrase-form, .workspace, .mode-switch, .note-editor-head, .note-view-langs')
    );
    if (document.activeElement !== phraseEl) return;
    if (event.target.closest('#phrase-form')) return;
    hideKeyboard();
  },
  true
);
phraseEl.addEventListener('blur', () => {
  if (appMode !== 'notes' || !notes?.isEditing()) return;
  window.setTimeout(() => {
    if (pointerInComposerChrome) return;
    if (document.activeElement === phraseEl) return;
    notes?.insertFromComposer();
  }, 80);
});

pad.on('change', updateHint);
pad.on('strokeEnd', queueRecognize);

function applyAppMode() {
  const notesOn = appMode === 'notes';
  appEl.classList.toggle('mode-notes', notesOn);
  appEl.classList.toggle('mode-dictionary', !notesOn);
  const pane = document.getElementById('notes-pane');
  if (pane) pane.hidden = !notesOn;
  document.querySelectorAll('.mode-switch [data-mode]').forEach((button) => {
    button.setAttribute('aria-selected', String(button.dataset.mode === appMode));
  });
  localStorage.setItem('sanpitsu-mode', appMode);
  if (notesOn) notes?.enter();
  else notes?.leave();
  window.setTimeout(() => pad.resize(), 40);
}

notes = createNotesController({
  appEl,
  getUser: () => user,
  getLanguage: () => language,
  getPhrase: () => phraseEl.value,
  setPhrase: (value) => {
    phraseEl.value = value;
  },
  setStatus,
  hideKeyboard,
  onOpenChange() {
    appEl.classList.toggle('note-open', Boolean(notes?.hasOpenNote()));
    window.setTimeout(() => pad.resize(), 40);
  },
  onHistory: persistHistory,
  getCardSort: () => cardSort,
});

document.querySelector('.mode-switch')?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-mode]');
  if (!button || button.dataset.mode === appMode) return;
  appMode = button.dataset.mode === 'notes' ? 'notes' : 'dictionary';
  applyAppMode();
});

function persistHistory(text, data, sourceLang) {
  if (!user || !saveHistoryEnabled || !text || !data) return;
  const lang = sourceLang || language;
  const key = `${lang}:${text}`;
  if (key === lastSavedHistory) return;
  lastSavedHistory = key;
  saveHistory(user.uid, {
    source: text,
    language: lang,
    zh: data.zh || null,
    ja: data.ja || null,
    ko: data.ko || null,
    en: data.en || null,
    gloss: data.gloss || '',
  }).catch(() => {});
}

function closeSheets() {
  backdropEl.hidden = true;
  menuSheet.hidden = true;
  historySheet.hidden = true;
  settingsSheet.hidden = true;
  cardSheet.hidden = true;
}

function openCardSheet(card) {
  const text = card?.dataset.text;
  if (!text) return;
  hideKeyboard();
  const lang = langById(card.dataset.key);
  cardSheetTitle.textContent = lang.name;
  setDisplay(cardSheetText, text);
  cardSheetText.lang = card.dataset.lang || lang.htmlLang;
  const reading = card.querySelector('.reading')?.dataset.display || '';
  setDisplay(cardSheetReading, reading);
  cardSheetReading.hidden = !reading;
  cardSheetBody.dataset.text = text;
  cardSheetBody.dataset.lang = card.dataset.lang || lang.tts;
  openSheet(cardSheet);
}

function openSheet(el) {
  closeSheets();
  backdropEl.hidden = false;
  el.hidden = false;
}

function syncSettingsForm() {
  settingLayoutEl.value = layout;
  settingHistoryEl.checked = saveHistoryEnabled;
  settingSpeakEl.checked = speakAfterTranslate;
  if (settingCardSortEl) settingCardSortEl.value = cardSort;
}

function historyPreview(entry) {
  return [
    entry.en?.text,
    entry.zh?.simplified,
    entry.ja?.text,
    entry.ko?.text,
    entry.gloss,
  ]
    .filter(Boolean)
    .slice(0, 3)
    .join('  ');
}

function historyWhen(entry) {
  if (!entry.createdAt?.toDate) return '';
  const date = entry.createdAt.toDate();
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : date.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function historyLangBlock(label, text, reading) {
  if (!text) return '';
  const read = reading
    ? `<span class="history-reading">${escapeHtml(reading)}</span>`
    : '';
  return `<p class="history-line"><span class="history-lang">${label}</span><span class="history-block"><span class="history-main">${escapeHtml(text)}</span>${read}</span></p>`;
}

function historyRowHtml(item) {
  const when = historyWhen(item);
  const zh = item.zh?.simplified || '';
  const zhT = item.zh?.traditional || '';
  const pinyin = item.zh?.pinyin || '';
  const ko = item.ko?.text || '';
  const koReading = [item.ko?.romanization, item.ko?.hanja].filter(Boolean).join('  ');
  const ja = item.ja?.text || '';
  const jaReading = [item.ja?.kana, item.ja?.romaji].filter(Boolean).join('  ');
  const en = item.en?.text || item.gloss || '';
  const enReading = item.gloss && item.gloss !== en ? item.gloss : '';
  return `<div class="history-row" data-id="${escapeHtml(item.id)}">
    <div class="history-item" role="button" tabindex="0">
      <div class="history-top">
        <div class="history-source">${escapeHtml(item.source || '')}</div>
        <div class="history-time">${escapeHtml(when)}</div>
      </div>
      <div class="history-meta">${escapeHtml(historyPreview(item))}</div>
      <div class="history-detail">
        ${historyLangBlock('EN', en, enReading)}
        ${historyLangBlock('简', zh, pinyin)}
        ${historyLangBlock('繁', zhT, pinyin)}
        ${historyLangBlock('한', ko, koReading)}
        ${historyLangBlock('日', ja, jaReading)}
        <button type="button" class="history-load">Load</button>
      </div>
    </div>
    <button type="button" class="history-delete" aria-label="Delete">✕</button>
  </div>`;
}

function historySentinel() {
  return historyListEl.querySelector('.history-sentinel');
}

function historyMatches(item) {
  if (historyLang && item.language !== historyLang) return false;
  const needle = historySearch.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    item.source,
    item.en?.text,
    item.zh?.simplified,
    item.zh?.traditional,
    item.zh?.pinyin,
    item.ja?.text,
    item.ja?.kana,
    item.ja?.romaji,
    item.ko?.text,
    item.ko?.romanization,
    item.ko?.hanja,
    item.gloss,
  ]
    .filter(Boolean)
    .join('\n')
    .toLowerCase();
  return haystack.includes(needle);
}

function visibleHistory() {
  return historyItems.filter(historyMatches);
}

function ensureHistoryScaffold() {
  historyListEl.querySelectorAll('.empty-note:not(.history-sentinel)').forEach((el) => el.remove());
  if (historySentinel()) return;
  historyListEl.insertAdjacentHTML(
    'beforeend',
    '<p class="history-sentinel empty-note" hidden>Loading more…</p>'
  );
}

function setHistoryStatus(done) {
  const el = historySentinel();
  if (!el) return;
  const more = !done && visibleHistory().length < HISTORY_PAGE;
  el.hidden = done && visibleHistory().length > 0;
  el.textContent = done ? (visibleHistory().length ? '' : 'No matches.') : 'Loading more…';
  if (done && visibleHistory().length) el.hidden = true;
  if (more) el.hidden = false;
}

function paintHistory() {
  const expanded = new Set(
    [...historyListEl.querySelectorAll('.history-row.expanded')].map((row) => row.dataset.id)
  );
  ensureHistoryScaffold();
  const sentinel = historySentinel();
  historyListEl.querySelectorAll('.history-row').forEach((row) => row.remove());
  const items = visibleHistory();
  if (!items.length && historyDone) {
    if (sentinel) {
      sentinel.hidden = false;
      sentinel.textContent = historyItems.length ? 'No matches.' : 'No saved translations yet.';
    }
    return;
  }
  sentinel.insertAdjacentHTML('beforebegin', items.map(historyRowHtml).join(''));
  historyListEl.querySelectorAll('.history-row').forEach((row) => {
    if (expanded.has(row.dataset.id)) row.classList.add('expanded');
  });
  setHistoryStatus(historyDone);
}

const historyObserver = new IntersectionObserver(
  (entries) => {
    if (entries.some((entry) => entry.isIntersecting)) loadMoreHistory();
  },
  { root: historyListEl, rootMargin: '120px' }
);

async function loadMoreHistory() {
  if (!user || historyLoading || historyDone) return;
  historyLoading = true;
  const isFirst = historyItems.length === 0;
  try {
    const page = await loadHistoryPage(user.uid, {
      pageSize: HISTORY_PAGE,
      cursor: historyCursor,
      sort: historySort,
    });
    const seen = new Set(historyItems.map((item) => item.id));
    const fresh = page.items.filter((item) => !seen.has(item.id));
    if (isFirst && !fresh.length) {
      historyDone = true;
      historyListEl.innerHTML = '<p class="empty-note">No saved translations yet.</p>';
      return;
    }
    if (isFirst) historyListEl.innerHTML = '';
    historyItems = historyItems.concat(fresh);
    historyCursor = page.cursor;
    historyDone = page.done || !page.items.length;
    paintHistory();
    historyObserver.disconnect();
    const sentinel = historySentinel();
    if (sentinel && !historyDone) historyObserver.observe(sentinel);
  } catch (error) {
    historyDone = true;
    if (!historyItems.length) {
      historyListEl.innerHTML = `<p class="empty-note">${escapeHtml(error.message || 'Could not load history.')}</p>`;
    } else {
      paintHistory();
    }
  } finally {
    historyLoading = false;
  }
  if (!historyDone && visibleHistory().length < HISTORY_PAGE) {
    window.setTimeout(() => loadMoreHistory(), 0);
  }
}

async function renderHistory() {
  historyObserver.disconnect();
  historyItems = [];
  historyCursor = null;
  historyDone = false;
  historyLoading = false;
  if (historyToolsEl) historyToolsEl.hidden = !user;
  if (!user) {
    historyListEl.innerHTML = '<p class="empty-note">Sign in to keep translations.</p>';
    return;
  }
  historyListEl.innerHTML = '<p class="empty-note">Loading…</p>';
  await loadMoreHistory();
}

function renderAccount() {
  if (!user) {
    accountBtn.classList.remove('signed-in');
    accountPhoto.hidden = true;
    accountPhoto.removeAttribute('src');
    accountLabel.hidden = false;
    accountLabel.textContent = 'G';
    accountBtn.setAttribute('aria-label', 'Sign in with Google');
    return;
  }
  accountBtn.classList.add('signed-in');
  accountBtn.setAttribute('aria-label', 'Account menu');
  if (user.photoURL) {
    accountPhoto.src = user.photoURL;
    accountPhoto.hidden = false;
    accountLabel.hidden = true;
    return;
  }
  accountPhoto.hidden = true;
  accountLabel.hidden = false;
  accountLabel.textContent = (user.displayName || 'U').slice(0, 1).toUpperCase();
}

accountBtn.hidden = !firebaseEnabled();
accountBtn.addEventListener('click', async () => {
  try {
    if (!user) {
      await signInWithGoogle();
      return;
    }
    document.getElementById('menu-name').textContent = user.displayName || 'Signed in';
    document.getElementById('menu-email').textContent = user.email || '';
    const menuPhoto = document.getElementById('menu-photo');
    if (user.photoURL) {
      menuPhoto.src = user.photoURL;
      menuPhoto.hidden = false;
    } else {
      menuPhoto.removeAttribute('src');
      menuPhoto.hidden = true;
    }
    openSheet(menuSheet);
  } catch (error) {
    setStatus(error.message || 'Sign-in failed.');
  }
});

backdropEl.addEventListener('click', closeSheets);
document.querySelectorAll('.sheet-close').forEach((button) => {
  button.addEventListener('click', closeSheets);
});

menuSheet.addEventListener('click', async (event) => {
  const open = event.target.closest('[data-open]');
  if (open?.dataset.open === 'history') {
    openSheet(historySheet);
    await renderHistory();
    return;
  }
  if (open?.dataset.open === 'notes') {
    closeSheets();
    appMode = 'notes';
    applyAppMode();
    notes?.showList();
    notes?.renderList();
    return;
  }
  if (open?.dataset.open === 'settings') {
    syncSettingsForm();
    openSheet(settingsSheet);
  }
});

document.getElementById('sign-out').addEventListener('click', async () => {
  closeSheets();
  await signOut();
});

function applyHistoryEntry(entry) {
  if (!entry?.source) return;
  if (appMode === 'notes') {
    appMode = 'dictionary';
    applyAppMode();
  }
  phraseEl.value = entry.source;
  if (entry.language && langById(entry.language).id === entry.language) {
    language = entry.language;
    applyLanguage();
  }
  lastTranslated = `${language}:${entry.source.trim()}`;
  renderResults(entry);
  closeSheets();
}

historySearchEl.addEventListener('input', () => {
  window.clearTimeout(historySearchTimer);
  historySearchTimer = window.setTimeout(() => {
    historySearch = historySearchEl.value;
    paintHistory();
    if (!historyDone && visibleHistory().length < HISTORY_PAGE) loadMoreHistory();
  }, 200);
});
historySearchEl.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  historySearchEl.blur();
});
historyLangEl.addEventListener('change', () => {
  historyLang = historyLangEl.value;
  paintHistory();
  if (!historyDone && visibleHistory().length < HISTORY_PAGE) loadMoreHistory();
});
historySortEl.addEventListener('change', () => {
  historySort = historySortEl.value;
  renderHistory();
});

historyListEl.addEventListener('click', async (event) => {
  const row = event.target.closest('.history-row');
  if (!row || !user) return;
  if (event.target.closest('.history-delete')) {
    const entry = historyItems.find((item) => item.id === row.dataset.id);
    const label = entry?.source ? `“${entry.source}”` : 'this translation';
    if (!window.confirm(`Delete ${label} from history?`)) return;
    await deleteHistory(user.uid, row.dataset.id);
    historyItems = historyItems.filter((item) => item.id !== row.dataset.id);
    if (!historyItems.length && historyDone) {
      historyListEl.innerHTML = '<p class="empty-note">No saved translations yet.</p>';
    } else {
      paintHistory();
      if (!historyDone && visibleHistory().length < HISTORY_PAGE) await loadMoreHistory();
    }
    return;
  }
  const entry = historyItems.find((item) => item.id === row.dataset.id);
  if (event.target.closest('.history-load')) {
    applyHistoryEntry(entry);
    return;
  }
  if (!event.target.closest('.history-item')) return;
  row.classList.toggle('expanded');
});

settingLayoutEl.addEventListener('change', () => {
  layout = settingLayoutEl.value === 'stack' ? 'stack' : 'grid';
  applyLayout();
});
settingHistoryEl.addEventListener('change', () => {
  saveHistoryEnabled = settingHistoryEl.checked;
  localStorage.setItem('sanpitsu-save-history', saveHistoryEnabled ? '1' : '0');
  persistPrefs();
});
settingSpeakEl.addEventListener('change', () => {
  speakAfterTranslate = settingSpeakEl.checked;
  localStorage.setItem('sanpitsu-speak', speakAfterTranslate ? '1' : '0');
  persistPrefs();
});
settingCardSortEl?.addEventListener('change', () => {
  cardSort = settingCardSortEl.value === 'oldest' ? 'oldest' : 'newest';
  localStorage.setItem('sanpitsu-card-sort', cardSort);
  persistPrefs();
  notes?.refreshCardOrder?.();
});

async function startApp() {
  await initFirebase();
  watchAuth((next) => {
  user = next;
  renderAccount();
  notes?.onAuth(next);
  if (!user) {
    watchPrefs(null);
    closeSheets();
    return;
  }
  watchPrefs(user.uid, (prefs) => {
    applyingRemotePrefs = true;
    if (prefs.language && prefs.language !== language) {
      language = prefs.language;
      applyLanguage();
    }
    if (prefs.layout === 'stack' || prefs.layout === 'grid') {
      layout = prefs.layout;
      applyLayout();
    }
    if (typeof prefs.saveHistory === 'boolean') {
      saveHistoryEnabled = prefs.saveHistory;
      localStorage.setItem('sanpitsu-save-history', saveHistoryEnabled ? '1' : '0');
    }
    if (typeof prefs.speakAfterTranslate === 'boolean') {
      speakAfterTranslate = prefs.speakAfterTranslate;
      localStorage.setItem('sanpitsu-speak', speakAfterTranslate ? '1' : '0');
    }
    if (prefs.cardSort === 'oldest' || prefs.cardSort === 'newest') {
      cardSort = prefs.cardSort;
      localStorage.setItem('sanpitsu-card-sort', cardSort);
      notes?.refreshCardOrder?.();
    }
    applyingRemotePrefs = false;
    syncSettingsForm();
  });
  persistPrefs();
});

applyLanguage();
applyLayout();
syncLayoutChrome();
applyAppMode();
window.addEventListener('resize', syncLayoutChrome);
updateHint();
renderResults(null);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
  });
}

window.speechSynthesis?.getVoices();
}

startApp();
