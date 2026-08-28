import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { detectSourceLang } from './detect.js';
import { getFirestoreDb } from './firebase.js';

export const NOTE_LANGS = ['en', 'zh_CN', 'zh_TW', 'ja', 'ko'];

export function emptyTranslations() {
  return { en: '', zh_CN: '', zh_TW: '', ja: '', ko: '' };
}

export function stripTags(value) {
  return String(value ?? '').replace(/<[^>]*>/g, '');
}

export function newBlockId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID().replace(/-/g, '').slice(0, 10);
  return `b${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function newBlock({ source = '', lang = 'zh_CN', type = 'paragraph', translations, id } = {}) {
  return {
    id: id || newBlockId(),
    type: type === 'header' || type === 'list' ? type : 'paragraph',
    source: stripTags(source),
    lang,
    translations: { ...emptyTranslations(), ...(translations || {}) },
  };
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
  };
  translations[fromLang] = source;
  return { fromLang, translations };
}

function notesCol(uid) {
  const db = getFirestoreDb();
  if (!db || !uid) return null;
  return collection(db, 'users', uid, 'notes');
}

export async function listNotes(uid) {
  const col = notesCol(uid);
  if (!col) return [];
  const snap = await getDocs(query(col, orderBy('updatedAt', 'desc')));
  return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
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
  const ref = await addDoc(col, {
    title: stripTags(payload.title || ''),
    sourceLang: payload.sourceLang || 'zh_CN',
    blocks: Array.isArray(payload.blocks) ? payload.blocks : [],
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
