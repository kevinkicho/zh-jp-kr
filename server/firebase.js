import admin from 'firebase-admin';

let ready = false;

export function initAdmin() {
  if (admin.apps.length) {
    ready = true;
    return admin;
  }

  const databaseURL = process.env.FIREBASE_DATABASE_URL;
  const onGcp = Boolean(
    process.env.FUNCTION_TARGET || process.env.K_SERVICE || process.env.FIREBASE_CONFIG
  );

  if (onGcp) {
    admin.initializeApp({ databaseURL });
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
