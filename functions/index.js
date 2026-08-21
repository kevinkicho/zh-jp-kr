import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { detectSourceLang } from './detect.js';
import { recognizeDirect, translateDirect } from './cjk.js';
import { ollamaEnabled, translateWithOllama } from './ollama.js';

const app = express();
app.use(express.json({ limit: '2mb' }));
const translationCache = new Map();

async function translateSmart(payload) {
  const text = String(payload?.text || '').trim();
  if (!text) throw new Error('Nothing to translate.');
  const requested = payload?.language;
  const sourceLang = detectSourceLang(text, requested);
  const cacheKey = `${sourceLang}:${text}`;
  if (translationCache.has(cacheKey)) return translationCache.get(cacheKey);

  let result = null;
  try {
    result = await translateWithOllama({ text, sourceLang });
  } catch (error) {
    console.error('Ollama translation failed, using Google fallback:', error.message);
  }
  if (!result) result = await translateDirect({ text, language: sourceLang });

  if (translationCache.size > 200) translationCache.clear();
  translationCache.set(cacheKey, result);
  return result;
}

function health(_req, res) {
  res.json({ ok: true, firebase: true, hasOllama: ollamaEnabled() });
}

app.get('/api/health', health);
app.get('/health', health);

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
    res.json(await translateSmart(req.body || {}));
  } catch (error) {
    res.status(502).json({ error: error.message || 'Translation failed.' });
  }
});
app.post('/translate', async (req, res) => {
  try {
    res.json(await translateSmart(req.body || {}));
  } catch (error) {
    res.status(502).json({ error: error.message || 'Translation failed.' });
  }
});

export const api = onRequest(
  {
    region: 'us-central1',
    cors: true,
    invoker: 'public',
    memory: '512MiB',
    timeoutSeconds: 60,
  },
  app
);
