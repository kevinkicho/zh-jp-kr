import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
} from 'firebase/firestore';
import { getDatabase, onValue, ref, update } from 'firebase/database';

const CONFIG_URLS = [
  '/firebase-config.json',
  '/api/firebase-config',
  'https://zh-kr-jp.web.app/firebase-config.json',
  'https://zh-kr-jp.web.app/api/firebase-config',
];

let enabled = false;
let app = null;
let auth = null;
let db = null;
let rtdb = null;
const provider = new GoogleAuthProvider();

function applyConfig(config) {
  if (!config?.apiKey || !config?.projectId || app) return;
  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);
  rtdb = getDatabase(app);
  enabled = true;
}

async function readConfig(url) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) return null;
  const data = await response.json().catch(() => null);
  return data?.apiKey ? data : null;
}

export async function initFirebase() {
  if (enabled) return true;
  const seen = new Set();
  for (const url of CONFIG_URLS) {
    if (seen.has(url)) continue;
    seen.add(url);
    try {
      applyConfig(await readConfig(url));
    } catch {
      // try the next source
    }
    if (enabled) return true;
  }
  return false;
}

let prefsUnsub = null;

export function firebaseEnabled() {
  return enabled;
}

export function getFirestoreDb() {
  return db;
}

export function currentUser() {
  return auth?.currentUser || null;
}

export function watchAuth(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  getRedirectResult(auth).catch(() => {});
  return onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle() {
  if (!auth) throw new Error('Firebase is not configured.');
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/popup-closed-by-user') {
      await signInWithRedirect(auth, provider);
      return;
    }
    throw error;
  }
}

export function signOut() {
  if (!auth) return Promise.resolve();
  return firebaseSignOut(auth);
}

export function watchPrefs(uid, callback) {
  if (prefsUnsub) {
    prefsUnsub();
    prefsUnsub = null;
  }
  if (!rtdb || !uid) return;
  const prefsRef = ref(rtdb, `users/${uid}/prefs`);
  prefsUnsub = onValue(prefsRef, (snap) => {
    callback(snap.val() || {});
  });
}

export function savePrefs(uid, prefs) {
  if (!rtdb || !uid) return Promise.resolve();
  return update(ref(rtdb, `users/${uid}/prefs`), prefs);
}

export function saveHistory(uid, entry) {
  if (!db || !uid) return Promise.resolve();
  return addDoc(collection(db, 'users', uid, 'history'), {
    ...entry,
    createdAt: serverTimestamp(),
  });
}

export async function loadHistoryPage(uid, { pageSize = 20, cursor = null, sort = 'newest' } = {}) {
  if (!db || !uid) return { items: [], cursor: null, done: true };
  const order =
    sort === 'oldest'
      ? orderBy('createdAt', 'asc')
      : sort === 'az'
        ? orderBy('source')
        : orderBy('createdAt', 'desc');
  const parts = [collection(db, 'users', uid, 'history'), order];
  if (cursor) parts.push(startAfter(cursor));
  parts.push(limit(pageSize));
  const snap = await getDocs(query(...parts));
  return {
    items: snap.docs.map((item) => ({ id: item.id, ...item.data() })),
    cursor: snap.docs[snap.docs.length - 1] || null,
    done: snap.docs.length < pageSize,
  };
}

export function deleteHistory(uid, id) {
  if (!db || !uid || !id) return Promise.resolve();
  return deleteDoc(doc(db, 'users', uid, 'history', id));
}
