import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { recognizeDirect, translateDirect } from './cjk.js';

const app = express();
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, firebase: true });
});
app.get('/health', (_req, res) => {
  res.json({ ok: true, firebase: true });
});

app.post('/api/recognize', async (req, res) => {
  try {
    res.json(await recognizeDirect(req.body || {}));
  } catch (error) {
    res.status(502).json({ error: error.message || 'Recognition failed.' });
  }
});
app.post('/recognize', async (req, res) => {
  try {
    res.json(await recognizeDirect(req.body || {}));
  } catch (error) {
    res.status(502).json({ error: error.message || 'Recognition failed.' });
  }
});

app.post('/api/translate', async (req, res) => {
  try {
    res.json(await translateDirect(req.body || {}));
  } catch (error) {
    res.status(502).json({ error: error.message || 'Translation failed.' });
  }
});
app.post('/translate', async (req, res) => {
  try {
    res.json(await translateDirect(req.body || {}));
  } catch (error) {
    res.status(502).json({ error: error.message || 'Translation failed.' });
  }
});

export const api = onRequest(
  {
    region: 'us-central1',
    cors: true,
    invoker: 'public',
    memory: '256MiB',
    timeoutSeconds: 30,
  },
  app
);
