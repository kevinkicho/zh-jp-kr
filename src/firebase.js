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
} from 'firebase/firestore';
import { getDatabase, onValue, ref, update } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

const enabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const app = enabled ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const rtdb = app ? getDatabase(app) : null;
const provider = new GoogleAuthProvider();

let prefsUnsub = null;

export function firebaseEnabled() {
  return enabled;
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

export async function loadHistory(uid, max = 80) {
  if (!db || !uid) return [];
  const q = query(
    collection(db, 'users', uid, 'history'),
    orderBy('createdAt', 'desc'),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export function deleteHistory(uid, id) {
  if (!db || !uid || !id) return Promise.resolve();
  return deleteDoc(doc(db, 'users', uid, 'history', id));
}
