import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import admin from 'firebase-admin';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let ready = false;

function findServiceAccount() {
  const fromEnv = String(process.env.GOOGLE_APPLICATION_CREDENTIALS || '').trim();
  const candidates = [
    fromEnv,
    path.join(root, fromEnv),
    path.join(root, 'zh-kr-jp-firebase-adminsdk-fbsvc-f66a0d33b2.json'),
  ].filter(Boolean);
  try {
    for (const name of fs.readdirSync(root)) {
      if (name.includes('firebase-adminsdk') && name.endsWith('.json')) {
        candidates.push(path.join(root, name));
      }
    }
  } catch {
    // ignore
  }
  const seen = new Set();
  for (const file of candidates) {
    const resolved = path.resolve(file);
    if (seen.has(resolved)) continue;
    seen.add(resolved);
    if (fs.existsSync(resolved)) return resolved;
  }
  return null;
}

export function initAdmin() {
  if (admin.apps.length) {
    ready = true;
    return admin;
  }

  const databaseURL = process.env.FIREBASE_DATABASE_URL || process.env.VITE_FIREBASE_DATABASE_URL;
  const onGcp = Boolean(
    process.env.FUNCTION_TARGET || process.env.K_SERVICE || process.env.FIREBASE_CONFIG
  );

  if (onGcp) {
    admin.initializeApp({ databaseURL });
    ready = true;
    return admin;
  }

  const serviceAccountPath = findServiceAccount();
  if (serviceAccountPath) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
      databaseURL,
    });
    ready = true;
    return admin;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.log('Firebase Admin not configured — skipping.');
    return null;
  }

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    databaseURL,
  });
  ready = true;
  return admin;
}

export function firebaseReady() {
  return ready;
}

export { admin };
