import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const outDir = process.argv[2] || 'dist';
const apiKey = process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_WEB_API_KEY || '';
const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || '';
if (!apiKey || !projectId) {
  console.log('No Firebase web config in env; skipped', outDir);
  process.exit(0);
}

const config = {
  apiKey,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || '',
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL || process.env.FIREBASE_DATABASE_URL || '',
};

const dest = path.join(outDir, 'firebase-config.json');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(dest, `${JSON.stringify(config)}\n`);
console.log('Wrote', dest);
