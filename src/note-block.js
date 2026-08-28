import { NOTE_LANGS, emptyTranslations, stripTags } from './notes.js';
import { langById } from './api.js';

const LABELS = {
  en: 'EN',
  zh_CN: '简',
  zh_TW: '繁',
  ja: '日',
  ko: '한',
};

function setDisplay(el, value) {
  if (!el) return;
  el.textContent = '';
  if (value) el.dataset.display = value;
  else delete el.dataset.display;
}

export class NoteParagraph {
  static get toolbox() {
    return {
      title: 'Text',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><text x="3" y="14" font-size="12">文</text></svg>',
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get enableLineBreaks() {
    return false;
  }

  static get pasteConfig() {
    return { tags: ['P', 'DIV', 'BR'] };
  }

  constructor({ data, api, config, readOnly, block }) {
    this.api = api;
    this.block = block;
    this.config = config || {};
    this.readOnly = readOnly;
    this.data = {
      source: stripTags(data?.source || data?.text || ''),
      lang: data?.lang || config.defaultLang || 'zh_CN',
      translations: { ...emptyTranslations(), ...(data?.translations || {}) },
    };
    this.translatedSource = this.data.source;
    this.wrapper = null;
    this.sourceEl = null;
    this.config.onCreate?.(this);
  }

  get blockId() {
    return this.block?.id || '';
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'note-block';
    this.wrapper.dataset.type = 'paragraph';
    this.paint();
    return this.wrapper;
  }

  paint() {
    if (!this.wrapper) return;
    this.painting = true;
    const lang = langById(this.data.lang);
    this.wrapper.replaceChildren();
    this.wrapper.classList.toggle('is-translating', Boolean(this.translating));
    this.wrapper.classList.toggle('is-selected', Boolean(this.selected));

    this.sourceEl = document.createElement('div');
    this.sourceEl.className = 'note-source';
    this.sourceEl.lang = lang.htmlLang;
    this.sourceEl.spellcheck = false;
    this.sourceEl.setAttribute('role', 'textbox');
    this.sourceEl.setAttribute('aria-label', 'Note line');
    if (this.readOnly) {
      this.sourceEl.contentEditable = 'false';
    } else {
      this.sourceEl.contentEditable = 'true';
    }
    this.sourceEl.textContent = this.data.source;
    this.sourceEl.addEventListener('input', () => {
      this.data.source = this.sourceEl.textContent || '';
      this.config.onDirty?.();
    });
    this.sourceEl.addEventListener('focus', () => {
      this.config.onFocusBlock?.(this);
    });
    this.sourceEl.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
      event.preventDefault();
      event.stopPropagation();
      this.syncFromDom();
      this.config.onCommitBlock?.(this);
      this.config.onRequestNewBlock?.(this);
    });
    this.sourceEl.addEventListener('blur', () => {
      if (this.painting) return;
      this.syncFromDom();
      this.config.onCommitBlock?.(this);
    });

    const xlate = document.createElement('div');
    xlate.className = 'note-xlate';
    for (const key of NOTE_LANGS) {
      if (key === this.data.lang) continue;
      const row = document.createElement('p');
      row.className = 'note-tr';
      row.dataset.key = key;
      const label = document.createElement('span');
      label.className = 'note-tr-label';
      label.textContent = LABELS[key] || key;
      const text = document.createElement('span');
      text.className = 'note-tr-text';
      setDisplay(text, this.data.translations[key] || '');
      row.append(label, text);
      xlate.append(row);
    }

    if (this.translating) {
      const status = document.createElement('p');
      status.className = 'note-block-status';
      status.textContent = 'Translating…';
      xlate.prepend(status);
    }

    this.wrapper.append(this.sourceEl, xlate);
    window.setTimeout(() => {
      this.painting = false;
    }, 0);
  }

  syncFromDom() {
    if (this.sourceEl) this.data.source = this.sourceEl.textContent || '';
  }

  appendSource(value) {
    this.syncFromDom();
    this.data.source = `${this.data.source || ''}${value || ''}`;
    if (this.sourceEl) this.sourceEl.textContent = this.data.source;
    this.config.onDirty?.();
  }

  setSource(value, lang) {
    this.data.source = stripTags(value || '');
    if (lang) this.data.lang = lang;
    if (this.sourceEl) {
      this.sourceEl.textContent = this.data.source;
      this.sourceEl.lang = langById(this.data.lang).htmlLang;
    }
    this.config.onDirty?.();
  }

  setTranslations(translations, lang) {
    this.data.translations = { ...emptyTranslations(), ...(translations || {}) };
    if (lang) this.data.lang = lang;
    this.translatedSource = this.data.source;
    this.translating = false;
    this.paint();
  }

  setTranslating(on) {
    this.translating = Boolean(on);
    this.paint();
  }

  setSelected(on) {
    this.selected = Boolean(on);
    this.wrapper?.classList.toggle('is-selected', this.selected);
  }

  needsTranslate() {
    const source = stripTags(this.data.source).trim();
    return Boolean(source) && source !== (this.translatedSource || '').trim();
  }

  save() {
    this.syncFromDom();
    return {
      source: stripTags(this.data.source),
      lang: this.data.lang,
      translations: { ...emptyTranslations(), ...this.data.translations },
    };
  }

  validate(saved) {
    return Boolean(stripTags(saved?.source || '').trim() || this.hasAnyTranslation(saved));
  }

  hasAnyTranslation(saved) {
    const tr = saved?.translations || {};
    return NOTE_LANGS.some((key) => stripTags(tr[key] || '').trim());
  }

  rendered() {
    return this.wrapper;
  }
}
