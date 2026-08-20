import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import { healthHandler, recognizeHandler, translateHandler } from './handlers.js';
import { initAdmin } from './firebase.js';

dotenv.config();
initAdmin();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const isProd = process.argv.includes('--prod');
const port = Number(process.env.PORT) || 5173;

const app = express();
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', healthHandler);
app.post('/api/recognize', recognizeHandler);
app.post('/api/translate', translateHandler);

app.use((err, req, res, next) => {
  if (!req.path.startsWith('/api/')) return next(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Server error' });
});

if (isProd) {
  const dist = path.join(root, 'dist');
  if (!fs.existsSync(path.join(dist, 'index.html'))) {
    console.error('Missing dist/. Run `npm run build` first.');
    process.exit(1);
  }
  app.use(express.static(dist));
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    res.sendFile(path.join(dist, 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    root,
    server: { middlewareMode: true, host: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

function lanAddress() {
  for (const addrs of Object.values(os.networkInterfaces())) {
    for (const net of addrs || []) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return null;
}

app.listen(port, '0.0.0.0', () => {
  const mode = isProd ? 'production' : 'dev';
  console.log(`三筆 Sanpitsu (${mode})  http://localhost:${port}`);
  const lan = lanAddress();
  if (lan) console.log(`Phone:                 http://${lan}:${port}`);
  if (process.env.FIREBASE_PROJECT_ID) {
    console.log(`Firebase project:      ${process.env.FIREBASE_PROJECT_ID}`);
  }
  if (!process.env.XAI_API_KEY) {
    console.log('No XAI_API_KEY set — translations will use the basic fallback.');
  }
});
