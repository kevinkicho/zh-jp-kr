import './style.css';
import { InkPad } from './canvas.js';
import { copyText, detectSourceLang, langById, recognize, speak, translate } from './api.js';
import {
  deleteHistory,
  firebaseEnabled,
  loadHistory,
  saveHistory,
  savePrefs,
  signInWithGoogle,
  signOut,
  watchAuth,
  watchPrefs,
} from './firebase.js';

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
const historyListEl = document.getElementById('history-list');
const settingLayoutEl = document.getElementById('setting-layout');
const settingHistoryEl = document.getElementById('setting-history');
const settingSpeakEl = document.getElementById('setting-speak');

let language = localStorage.getItem('sanpitsu-lang') || 'zh_CN';
if (!langById(language).id || language !== langById(language).id) language = 'zh_CN';
let layout = localStorage.getItem('sanpitsu-layout') === 'stack' ? 'stack' : 'grid';

let candidates = [];
let recognizeTimer = 0;
let translateTimer = 0;
let recognizeSeq = 0;
let translateSeq = 0;
let user = null;
let applyingRemotePrefs = false;
let lastSavedHistory = '';
let historyItems = [];
let saveHistoryEnabled = localStorage.getItem('sanpitsu-save-history') !== '0';
let speakAfterTranslate = localStorage.getItem('sanpitsu-speak') === '1';

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
  queueTranslate();
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

function fillCard(key, { text, reading, explain, speakLang, isSource }) {
  const card = resultsEl.querySelector(`[data-key="${key}"]`);
  if (!card) return;
  card.classList.toggle('source', Boolean(isSource && text));
  card.dataset.text = text;
  card.dataset.lang = speakLang;
  card.querySelector('.text').textContent = text;
  const readingEl = card.querySelector('.reading');
  readingEl.textContent = reading;
  readingEl.hidden = !reading;
  const explainEl = card.querySelector('.explain');
  if (explainEl) {
    explainEl.textContent = explain || '';
    explainEl.hidden = !explain;
  }
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
      data.ko?.hanja ? `한자 ${data.ko.hanja}` : '',
    ]
      .filter(Boolean)
      .join(' · '),
    speakLang: 'ko-KR',
    isSource: fromLang === 'ko',
  });
  fillCard('ja', {
    text: jaText,
    reading: [data.ja?.kana, data.ja?.romaji].filter(Boolean).join(' · '),
    speakLang: 'ja-JP',
    isSource: fromLang === 'ja',
  });
}

async function runTranslate() {
  const text = phraseEl.value.trim();
  if (!text) {
    renderResults(null);
    return;
  }
  const seq = ++translateSeq;
  setStatus('Translating…');
  try {
    const data = await translate({ text, language });
    if (seq !== translateSeq) return;
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

function queueTranslate() {
  clearTimeout(translateTimer);
  translateTimer = window.setTimeout(runTranslate, 450);
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
  if (phraseEl.value.trim()) queueTranslate();
});

candidatesEl.addEventListener('click', (event) => {
  const button = event.target.closest('.candidate');
  if (!button) return;
  appendText(candidates[Number(button.dataset.index)]);
});

let cardPressTimer = 0;
let cardLongPress = false;

resultsEl.addEventListener('pointerdown', (event) => {
  const card = event.target.closest('.card');
  if (!card?.dataset.text) return;
  cardLongPress = false;
  clearTimeout(cardPressTimer);
  cardPressTimer = window.setTimeout(async () => {
    cardLongPress = true;
    await copyText(card.dataset.text);
    setStatus('Copied');
    setTimeout(() => setStatus(''), 800);
  }, 480);
});

resultsEl.addEventListener('pointerup', (event) => {
  clearTimeout(cardPressTimer);
  const card = event.target.closest('.card');
  if (!card?.dataset.text || cardLongPress) return;
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  speak(card.dataset.text, card.dataset.lang);
});

resultsEl.addEventListener('pointercancel', () => {
  clearTimeout(cardPressTimer);
});

resultsEl.addEventListener('pointerleave', (event) => {
  if (event.target === resultsEl) clearTimeout(cardPressTimer);
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
  if (candidates[0]) {
    appendText(candidates[0]);
    return;
  }
  if (pad.hasInk()) runRecognize();
});

document.getElementById('backspace').addEventListener('click', () => {
  phraseEl.value = [...phraseEl.value].slice(0, -1).join('');
  queueTranslate();
});

document.getElementById('clear-text').addEventListener('click', () => {
  phraseEl.value = '';
  renderResults(null);
  setStatus('');
});

phraseEl.addEventListener('input', (event) => {
  if (!event.isComposing) syncLangFromText();
  queueTranslate();
});
phraseEl.addEventListener('compositionend', () => {
  syncLangFromText();
  queueTranslate();
});
phraseEl.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    runTranslate();
  }
});

pad.on('change', updateHint);
pad.on('strokeEnd', queueRecognize);

function persistHistory(text, data) {
  if (!user || !saveHistoryEnabled || !text || !data) return;
  const key = `${language}:${text}`;
  if (key === lastSavedHistory) return;
  lastSavedHistory = key;
  saveHistory(user.uid, {
    source: text,
    language,
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
    .join(' · ');
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

async function renderHistory() {
  if (!user) {
    historyItems = [];
    historyListEl.innerHTML = '<p class="empty-note">Sign in to keep translations.</p>';
    return;
  }
  historyListEl.innerHTML = '<p class="empty-note">Loading…</p>';
  try {
    historyItems = await loadHistory(user.uid);
    if (!historyItems.length) {
      historyListEl.innerHTML = '<p class="empty-note">No saved translations yet.</p>';
      return;
    }
    historyListEl.innerHTML = historyItems
      .map((item) => {
        const when = historyWhen(item);
        const zh = item.zh?.simplified || '';
        const zhT = item.zh?.traditional || '';
        const ko = item.ko?.text || '';
        const ja = item.ja?.text || '';
        const en = item.en?.text || item.gloss || '';
        return `<div class="history-row" data-id="${escapeHtml(item.id)}">
          <div class="history-item" role="button" tabindex="0">
            <div class="history-top">
              <div class="history-source">${escapeHtml(item.source || '')}</div>
              <div class="history-time">${escapeHtml(when)}</div>
            </div>
            <div class="history-meta">${escapeHtml(historyPreview(item))}</div>
            <div class="history-detail">
              ${en ? `<p class="history-line"><span>EN</span> ${escapeHtml(en)}</p>` : ''}
              ${zh ? `<p class="history-line"><span>简</span> ${escapeHtml(zh)}</p>` : ''}
              ${zhT && zhT !== zh ? `<p class="history-line"><span>繁</span> ${escapeHtml(zhT)}</p>` : ''}
              ${ko ? `<p class="history-line"><span>한</span> ${escapeHtml(ko)}</p>` : ''}
              ${ja ? `<p class="history-line"><span>日</span> ${escapeHtml(ja)}</p>` : ''}
              ${item.gloss ? `<p class="history-line"><span>英</span> ${escapeHtml(item.gloss)}</p>` : ''}
              <button type="button" class="history-load">Load</button>
            </div>
          </div>
          <button type="button" class="history-delete" aria-label="Delete">✕</button>
        </div>`;
      })
      .join('');
  } catch (error) {
    historyItems = [];
    historyListEl.innerHTML = `<p class="empty-note">${escapeHtml(error.message || 'Could not load history.')}</p>`;
  }
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
  phraseEl.value = entry.source;
  if (entry.language && langById(entry.language).id === entry.language) {
    language = entry.language;
    applyLanguage();
  }
  renderResults(entry);
  closeSheets();
}

historyListEl.addEventListener('click', async (event) => {
  const row = event.target.closest('.history-row');
  if (!row || !user) return;
  if (event.target.closest('.history-delete')) {
    const entry = historyItems.find((item) => item.id === row.dataset.id);
    const label = entry?.source ? `“${entry.source}”` : 'this translation';
    if (!window.confirm(`Delete ${label} from history?`)) return;
    await deleteHistory(user.uid, row.dataset.id);
    await renderHistory();
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

watchAuth((next) => {
  user = next;
  renderAccount();
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
    applyingRemotePrefs = false;
    syncSettingsForm();
  });
  persistPrefs();
});

applyLanguage();
applyLayout();
updateHint();
renderResults(null);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
  });
}

window.speechSynthesis?.getVoices();
