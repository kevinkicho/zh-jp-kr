import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { detectSourceLang } from './detect.js';
import { getFirestoreDb } from './firebase.js';

export const NOTE_LANGS = ['en', 'zh_CN', 'zh_TW', 'ja', 'ko'];
export const NOTE_READINGS = ['zh_pinyin', 'ja_romaji', 'ko_romanization'];
export const NOTE_ROWS = [
  { key: 'en', label: 'EN' },
  { key: 'zh_CN', label: '简' },
  { key: 'zh_pinyin', label: '拼音' },
  { key: 'zh_TW', label: '繁' },
  { key: 'ja', label: '日' },
  { key: 'ja_romaji', label: 'ロマ' },
  { key: 'ko', label: '한' },
  { key: 'ko_romanization', label: '로마' },
];

export function emptyTranslations() {
  return {
    en: '',
    zh_CN: '',
    zh_TW: '',
    ja: '',
    ko: '',
    zh_pinyin: '',
    ja_romaji: '',
    ko_romanization: '',
  };
}

export function stripTags(value) {
  return String(value ?? '').replace(/<[^>]*>/g, '');
}

export function newBlockId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID().replace(/-/g, '').slice(0, 10);
  return `b${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function newBlock({ source = '', lang = 'zh_CN', type = 'paragraph', translations, id, createdAt } = {}) {
  return {
    id: id || newBlockId(),
    type: type === 'header' || type === 'list' ? type : 'paragraph',
    source: stripTags(source),
    lang,
    createdAt: Number.isFinite(Number(createdAt)) ? Number(createdAt) : Date.now(),
    translations: { ...emptyTranslations(), ...(translations || {}) },
  };
}

export function cardTime(block, fallback = 0) {
  const n = Number(block?.createdAt);
  return Number.isFinite(n) ? n : fallback;
}

export function translationsFromApi(text, language, data) {
  const source = stripTags(text).trim();
  const fromLang = detectSourceLang(source, data?.sourceLang || language);
  const translations = {
    en: fromLang === 'en' ? source : data?.en?.text || data?.gloss || '',
    zh_CN: data?.zh?.simplified || (fromLang === 'zh_CN' || fromLang === 'zh_TW' ? source : ''),
    zh_TW: data?.zh?.traditional || (fromLang === 'zh_TW' ? source : ''),
    ja: fromLang === 'ja' ? source : data?.ja?.text || '',
    ko: fromLang === 'ko' ? source : data?.ko?.text || '',
    zh_pinyin: data?.zh?.pinyin || '',
    ja_romaji: data?.ja?.romaji || data?.ja?.kana || '',
    ko_romanization: data?.ko?.romanization || '',
  };
  translations[fromLang] = source;
  return { fromLang, translations };
}

function notesCol(uid) {
  const db = getFirestoreDb();
  if (!db || !uid) return null;
  return collection(db, 'users', uid, 'notes');
}

function stampMs(value) {
  if (!value) return 0;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.toDate === 'function') return value.toDate().getTime();
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value.seconds === 'number') return value.seconds * 1000;
  return 0;
}

export function nextFrontSortOrder(notes) {
  let found = false;
  let min = 0;
  for (const note of notes || []) {
    if (typeof note?.sortOrder === 'number' && Number.isFinite(note.sortOrder)) {
      if (!found || note.sortOrder < min) min = note.sortOrder;
      found = true;
    }
  }
  return found ? min - 1 : 0;
}

export function compareNotes(a, b) {
  const aOrder = typeof a?.sortOrder === 'number' && Number.isFinite(a.sortOrder);
  const bOrder = typeof b?.sortOrder === 'number' && Number.isFinite(b.sortOrder);
  if (aOrder && bOrder && a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
  if (aOrder && !bOrder) return -1;
  if (!aOrder && bOrder) return 1;
  return stampMs(b?.updatedAt || b?.createdAt) - stampMs(a?.updatedAt || a?.createdAt);
}

export async function listNotes(uid) {
  const col = notesCol(uid);
  if (!col) return [];
  const snap = await getDocs(col);
  return snap.docs.map((item) => ({ id: item.id, ...item.data() })).sort(compareNotes);
}

export async function updateNoteOrder(uid, ids) {
  const db = getFirestoreDb();
  if (!db || !uid || !Array.isArray(ids) || !ids.length) return;
  const remote = ids
    .map((id, index) => ({ id, index }))
    .filter((item) => item.id && !String(item.id).startsWith('local-'));
  const chunkSize = 400;
  for (let i = 0; i < remote.length; i += chunkSize) {
    const batch = writeBatch(db);
    for (const item of remote.slice(i, i + chunkSize)) {
      batch.update(doc(db, 'users', uid, 'notes', item.id), { sortOrder: item.index });
    }
    await batch.commit();
  }
}

export async function getNote(uid, id) {
  const db = getFirestoreDb();
  if (!db || !uid || !id) return null;
  const snap = await getDoc(doc(db, 'users', uid, 'notes', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createNote(uid, payload = {}) {
  const col = notesCol(uid);
  if (!col) throw new Error('Sign in to save notes.');
  let sortOrder = payload.sortOrder;
  if (typeof sortOrder !== 'number' || !Number.isFinite(sortOrder)) {
    sortOrder = nextFrontSortOrder(await listNotes(uid));
  }
  const ref = await addDoc(col, {
    title: stripTags(payload.title || ''),
    sourceLang: payload.sourceLang || 'zh_CN',
    blocks: Array.isArray(payload.blocks) ? payload.blocks : [],
    sortOrder,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function saveNote(uid, id, payload) {
  const db = getFirestoreDb();
  if (!db || !uid || !id) return;
  await updateDoc(doc(db, 'users', uid, 'notes', id), {
    title: stripTags(payload.title || ''),
    sourceLang: payload.sourceLang || 'zh_CN',
    blocks: Array.isArray(payload.blocks) ? payload.blocks : [],
    updatedAt: serverTimestamp(),
  });
}

export async function deleteNote(uid, id) {
  const db = getFirestoreDb();
  if (!db || !uid || !id) return;
  await deleteDoc(doc(db, 'users', uid, 'notes', id));
}

export function notePreview(note) {
  const title = stripTags(note?.title || '').trim();
  if (title) return title;
  const first = (note?.blocks || []).find((block) => stripTags(block.source || '').trim());
  return stripTags(first?.source || '').trim().slice(0, 48) || 'Untitled';
}

export function noteWhen(note) {
  const stamp = note?.updatedAt || note?.createdAt;
  if (!stamp?.toDate) return '';
  const date = stamp.toDate();
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : date.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}
