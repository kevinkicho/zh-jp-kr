# 三筆 Sanpitsu

A mobile web app for drawing or typing **English, Chinese, Japanese, or Korean** and seeing the translation in all of them at once.

Tap a translation to hear it. Press and hold to copy.

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

- Finger handwriting and keyboard input
- Language dropdown: English, 简体中文, 繁體中文, 日本語, 한국어
- English row plus a 2×2 grid (or stacked rows) for 简 / 繁 / 한 / 日
- Tap a card to speak, long-press to copy
- Google sign-in, history, and settings
- PWA — add it to the home screen

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 (or the LAN address printed in the terminal, on a phone).

Copy `.env.example` to `.env`. Keep Firebase Admin keys and `.env` out of git.

```bash
npm run build
npm start          # production Node server
npm run deploy     # Firebase Hosting + functions
```

## License

[MIT](LICENSE)
