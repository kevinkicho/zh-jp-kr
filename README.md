# 三筆 Sanpitsu

A mobile web app for drawing or typing **English, Chinese, Japanese, or Korean** and seeing the translation in all of them at once.

Tap a translation to hear it. Press and hold to copy. Tap **⤢** for the full text and readings.

**Live:** [https://zh-kr-jp.web.app](https://zh-kr-jp.web.app)

<p align="center">
  <img src="screenshots/app-zh.png" alt="Drawing 今天 in simplified Chinese" width="28%" />
  &nbsp;
  <img src="screenshots/app-ja.png" alt="Japanese phrase 皆さん大好き" width="28%" />
  &nbsp;
  <img src="screenshots/app-ko.png" alt="Drawing 오케이 in Korean" width="28%" />
</p>

All application code in this repository was written by **Grok 4.6** (xAI).

## Features

- Finger handwriting (Google Input Tools) and keyboard input
- Language dropdown: English, 简体中文, 繁體中文, 日本語, 한국어
- English row plus a 2×2 grid (or stacked rows) for 简 / 繁 / 한 / 日
- Readings on each card: pinyin, Hangul romanization and hanja, kana and romaji
- Tap a card to speak, long-press to copy, **⤢** to open a full-text sheet
- Translate only when you submit — **Done / Enter** on the keyboard, or **Add** after handwriting — so typing does not call the API
- The mobile keyboard dismisses on submit or when you tap outside the field
- Ollama Cloud for natural CJK translations, with Google Translate as fallback
- Google sign-in, settings, and history (search, language filter, newest / oldest / A–Z, paged 20 at a time)
- History rows expand to the same detail as the cards (pronunciation included)
- PWA — add it to the home screen

## Notes

Dictionary is unchanged. Switch to **Notes** for a multi-line document that you can reopen later.

- Sign in, tap **New**, then type or draw the same way as Dictionary. Suggestion cards still appear.
- A line is translated on **Done / Enter**, **Add**, picking a handwriting suggestion, or leaving the line — not on every keystroke.
- Each line keeps 英 / 简 / 繁 / 日 / 한 under it (or use the language toggle). The Dictionary card grid is not used here.
- Notes live in Firestore at `users/{uid}/notes/{noteId}` and stay private to that account.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 (or the LAN address printed in the terminal, on a phone).

Copy `.env.example` to `.env`. Keep Firebase Admin keys, `OLLAMA_API_KEY`, and `.env` out of git.

```
OLLAMA_API_KEY=          # Ollama Cloud, server-side only
OLLAMA_MODEL=gemma4:31b  # optional; gpt-oss:20b is the fallback
```

Translations use **Ollama Cloud** first, then Google Translate if the model is unavailable. The key is never shipped to the browser (local Express and Cloud Functions only). Handwriting recognition still uses Google Input Tools.

```bash
npm run build
npm start          # production Node server
npm run deploy     # Firebase Hosting + functions
```

Deployed functions read `functions/.env` for `OLLAMA_API_KEY` (also gitignored).

## License

[MIT](LICENSE)
