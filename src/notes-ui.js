import { detectSourceLang, langById, speak, translate } from './api.js';
import { firebaseEnabled } from './firebase.js';
import {
  NOTE_LANGS,
  NOTE_ROWS,
  createNote,
  deleteNote,
  emptyTranslations,
  getNote,
  listNotes,
  newBlockId,
  nextFrontSortOrder,
  notePreview,
  noteWhen,
  saveNote,
  stripTags,
  translationsFromApi,
  updateNoteOrder,
} from './notes.js';

const LABELS = Object.fromEntries(NOTE_ROWS.map((row) => [row.key, row.label]));
const ALL_KEYS = NOTE_ROWS.map((row) => row.key);
const TTS_BY_KEY = {
  en: 'en-US',
  zh_CN: 'zh-CN',
  zh_TW: 'zh-TW',
  zh_pinyin: 'zh-CN',
  ja: 'ja-JP',
  ja_romaji: 'ja-JP',
  ko: 'ko-KR',
  ko_romanization: 'ko-KR',
};

const READING_SPEAK = {
  zh_pinyin: { keys: ['zh_CN', 'zh_TW'], ttsKey: 'zh_CN' },
  ja_romaji: { keys: ['ja'], ttsKey: 'ja' },
  ko_romanization: { keys: ['ko'], ttsKey: 'ko' },
};

function speakKey(text, key) {
  const value = String(text || '').trim();
  if (!value) return;
  speak(value, TTS_BY_KEY[key] || langById(key).tts);
}

function speakSource(block) {
  const value = String(block.source || '').trim();
  if (!value) return;
  speak(value, langById(block.lang).tts);
}

function textForLang(block, key) {
  if (block.lang === key && block.source) return block.source;
  return block.translations?.[key] || '';
}

function speakRow(block, key, fallback) {
  const reading = READING_SPEAK[key];
  if (reading) {
    const spoken = reading.keys.map((item) => textForLang(block, item)).find((item) => String(item || '').trim());
    speakKey(spoken, reading.ttsKey);
    return;
  }
  speakKey(fallback, key);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const DRAG_THRESHOLD = 6;

function makeDragHandle(className, label) {
  const handle = document.createElement('button');
  handle.type = 'button';
  handle.className = `${className} note-grip`.trim();
  handle.setAttribute('aria-label', label);
  handle.title = 'Drag to reorder';
  handle.draggable = false;
  handle.textContent = '';
  for (let i = 0; i < 6; i += 1) {
    handle.append(document.createElement('span'));
  }
  handle.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  handle.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  return handle;
}

function resolveEl(value) {
  return typeof value === 'function' ? value() : value;
}

function bindReorderHandle(handle, { item, container, itemSelector, onCommit, onDragEnd, onTap }) {
  handle.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();

    const pointerId = event.pointerId;
    const startX = event.clientX;
    const startY = event.clientY;
    let active = true;
    let dragging = false;
    let placeholder = null;
    let startIndex = -1;
    let grabOffsetY = 0;

    const release = () => {
      try {
        handle.releasePointerCapture(pointerId);
      } catch {
        // already released
      }
    };

    const clearInline = () => {
      item.classList.remove('is-dragging');
      item.style.position = '';
      item.style.left = '';
      item.style.top = '';
      item.style.width = '';
      item.style.height = '';
      item.style.zIndex = '';
      item.style.pointerEvents = '';
      item.style.margin = '';
      item.style.transform = '';
    };

    const teardown = (commit) => {
      if (!active) return;
      active = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      document.body.classList.remove('is-reordering');
      release();

      let toIndex = startIndex;
      const root = resolveEl(container);
      if (placeholder?.parentElement && root) {
        const kids = [...root.children].filter(
          (el) => el === placeholder || (el.matches?.(itemSelector) && el !== item)
        );
        toIndex = kids.indexOf(placeholder);
        placeholder.remove();
      }
      placeholder = null;
      clearInline();
      if (dragging) onDragEnd?.();
      if (commit && dragging && toIndex >= 0 && toIndex !== startIndex) {
        onCommit(startIndex, toIndex);
      } else if (commit && !dragging) {
        onTap?.();
      }
    };

    const moveGhost = (clientY) => {
      item.style.top = `${clientY - grabOffsetY}px`;
    };

    const placePlaceholder = (clientY) => {
      if (!placeholder) return;
      const root = resolveEl(container);
      if (!root) return;
      const others = [...root.querySelectorAll(itemSelector)].filter((el) => el !== item);
      let before = null;
      for (const el of others) {
        const rect = el.getBoundingClientRect();
        if (clientY < rect.top + rect.height / 2) {
          before = el;
          break;
        }
      }
      if (before) {
        if (placeholder.nextElementSibling !== before) before.before(placeholder);
      } else if (others.length) {
        const last = others[others.length - 1];
        if (last.nextElementSibling !== placeholder) last.after(placeholder);
      }
    };

    const scrollNearEdge = (clientY) => {
      const root = resolveEl(container);
      if (!root) return;
      const scroller = root.closest?.('.note-editor, .notes-list') || root;
      if (!scroller) return;
      const rect = scroller.getBoundingClientRect();
      const edge = 56;
      if (clientY < rect.top + edge) scroller.scrollTop -= 16;
      else if (clientY > rect.bottom - edge) scroller.scrollTop += 16;
    };

    const startDrag = (e) => {
      dragging = true;
      document.body.classList.add('is-reordering');
      const originRect = item.getBoundingClientRect();
      grabOffsetY = startY - originRect.top;
      const root = resolveEl(container);
      if (!root) return;
      const list = [...root.querySelectorAll(itemSelector)];
      startIndex = list.indexOf(item);
      placeholder = document.createElement('div');
      placeholder.className = item.classList.contains('note-card')
        ? 'note-reorder-placeholder note-card-placeholder'
        : 'note-reorder-placeholder notes-row-placeholder';
      placeholder.style.height = `${originRect.height}px`;
      placeholder.setAttribute('aria-hidden', 'true');
      item.after(placeholder);
      item.classList.add('is-dragging');
      item.style.position = 'fixed';
      item.style.left = `${originRect.left}px`;
      item.style.top = `${originRect.top}px`;
      item.style.width = `${originRect.width}px`;
      item.style.height = `${originRect.height}px`;
      item.style.zIndex = '40';
      item.style.pointerEvents = 'none';
      item.style.margin = '0';
      moveGhost(e.clientY);
      placePlaceholder(e.clientY);
    };

    const onMove = (e) => {
      if (!active || e.pointerId !== pointerId) return;
      if (!dragging) {
        if (Math.abs(e.clientX - startX) < DRAG_THRESHOLD && Math.abs(e.clientY - startY) < DRAG_THRESHOLD) {
          return;
        }
        startDrag(e);
      }
      e.preventDefault();
      moveGhost(e.clientY);
      placePlaceholder(e.clientY);
      scrollNearEdge(e.clientY);
    };

    const onUp = (e) => {
      if (e.pointerId !== pointerId) return;
      teardown(true);
    };

    const onCancel = (e) => {
      if (e.pointerId !== pointerId) return;
      teardown(false);
    };

    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
    try {
      handle.setPointerCapture(pointerId);
    } catch {
      // capture is best-effort
    }
  });
}

function setDisplay(el, value) {
  if (!el) return;
  el.textContent = '';
  if (value) el.dataset.display = value;
  else delete el.dataset.display;
}

export function createNotesController({
  appEl,
  getUser,
  getLanguage,
  getPhrase,
  setPhrase,
  setStatus,
  hideKeyboard,
  onOpenChange,
  onHistory,
}) {
  const pane = document.getElementById('notes-pane');
  const listView = document.getElementById('notes-list-view');
  const editorView = document.getElementById('note-editor-view');
  const listEl = document.getElementById('notes-list');
  const titleEl = document.getElementById('note-title');
  const editorHolder = document.getElementById('note-editor');
  const viewLangs = document.getElementById('note-view-langs');

  let currentNote = null;
  let cards = [];
  let notesCache = [];
  let suppressListClickUntil = 0;
  let sourceEl = null;
  let cardsEl = null;
  let viewKeys = new Set(['all']);
  let selectedIds = new Set();
  let saveTimer = 0;
  let titleTimer = 0;
  let persistSeq = 0;
  let translateSeq = 0;
  let entered = false;
  let editingId = null;
  let caret = { start: 0, end: 0 };
  let titleCaret = { start: 0, end: 0 };
  let insertTarget = 'body';

  function userId() {
    return getUser()?.uid || null;
  }

  function hasOpenNote() {
    return Boolean(currentNote?.id);
  }

  function isEditing() {
    return entered && hasOpenNote();
  }

  function setNoteOpenClass() {
    appEl?.classList.toggle('note-open', hasOpenNote());
    onOpenChange?.(hasOpenNote());
  }

  function showingAll() {
    return viewKeys.has('all') || viewKeys.size === 0;
  }

  function rowVisible(key, sourceLang) {
    if (key === sourceLang) return false;
    if (showingAll()) return true;
    return viewKeys.has(key);
  }

  function applyViewLang() {
    if (editorView) editorView.dataset.viewLangs = showingAll() ? 'all' : [...viewKeys].join(' ');
    if (!viewLangs) return;
    viewLangs.querySelectorAll('[data-view-lang]').forEach((button) => {
      const key = button.dataset.viewLang;
      const on = showingAll() ? key === 'all' : viewKeys.has(key);
      button.setAttribute('aria-pressed', String(on));
    });
    editorHolder?.querySelectorAll('.note-tr').forEach((row) => {
      const card = row.closest('.note-card');
      const lang = cards.find((item) => item.id === card?.dataset.id)?.lang;
      row.hidden = !rowVisible(row.dataset.key, lang);
    });
    const tools = document.getElementById('note-card-tools');
    if (tools) tools.hidden = selectedIds.size === 0;
  }

  function composeText() {
    return sourceEl ? sourceEl.value : '';
  }

  function fitCompose() {
    if (!sourceEl) return;
    sourceEl.style.height = 'auto';
    sourceEl.style.height = `${Math.max(sourceEl.scrollHeight, 40)}px`;
  }

  function cardNode(block) {
    const wrap = document.createElement('article');
    wrap.className = 'note-block note-card';
    wrap.dataset.id = block.id;
    wrap.tabIndex = 0;
    wrap.setAttribute('aria-label', 'Translation card');
    if (editingId === block.id) wrap.classList.add('is-editing');
    if (selectedIds.has(block.id)) wrap.classList.add('is-selected');
    const pick = makeDragHandle('note-card-select', 'Select or reorder this card');
    pick.setAttribute('aria-pressed', String(selectedIds.has(block.id)));
    pick.title = 'Tap to select, drag to reorder';
    const source = document.createElement('p');
    source.className = 'note-card-source';
    source.lang = langById(block.lang).htmlLang;
    source.textContent = block.source || '';
    source.title = 'Tap to listen, hold to edit';
    source.setAttribute('role', 'button');
    let sourceHold = 0;
    const clearSourceHold = () => {
      if (sourceHold) window.clearTimeout(sourceHold);
      sourceHold = 0;
    };
    source.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      clearSourceHold();
      sourceHold = window.setTimeout(() => {
        sourceHold = 0;
        beginEdit(block.id);
      }, 480);
    });
    source.addEventListener('pointerup', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!sourceHold) return;
      clearSourceHold();
      speakSource(block);
    });
    source.addEventListener('pointercancel', clearSourceHold);
    const xlate = document.createElement('div');
    xlate.className = 'note-xlate';
    for (const rowDef of NOTE_ROWS) {
      const key = rowDef.key;
      if (!rowVisible(key, block.lang)) continue;
      const value = block.translations?.[key] || '';
      if (!String(value).trim() && !showingAll()) continue;
      const row = document.createElement('p');
      row.className = 'note-tr';
      row.dataset.key = key;
      const label = document.createElement('span');
      label.className = 'note-tr-label';
      label.textContent = rowDef.label;
      const text = document.createElement('span');
      text.className = 'note-tr-text';
      setDisplay(text, value);
      row.title = 'Tap to listen';
      row.setAttribute('role', 'button');
      row.append(label, text);
      row.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        event.stopPropagation();
        speakRow(block, key, value);
      });
      xlate.append(row);
    }
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'note-card-edit';
    const editing = editingId === block.id;
    edit.setAttribute('aria-label', editing ? 'Done editing' : 'Edit this card');
    edit.textContent = editing ? 'Done' : 'Edit';
    edit.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      beginEdit(block.id);
    });
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'note-card-delete';
    del.setAttribute('aria-label', 'Delete this card');
    del.textContent = '✕';
    del.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      removeCard(block.id);
    });
    bindReorderHandle(pick, {
      item: wrap,
      container: () => cardsEl,
      itemSelector: '.note-card',
      onCommit: reorderCards,
      onTap: () => toggleSelect(block.id),
    });
    wrap.append(pick, edit, del, source, xlate);
    return wrap;
  }

  function toggleSelect(id) {
    if (selectedIds.has(id)) selectedIds.delete(id);
    else selectedIds.add(id);
    renderCards();
    applyViewLang();
  }

  function removeSelected() {
    if (!selectedIds.size) return;
    const n = selectedIds.size;
    if (!window.confirm(`Delete ${n} card${n === 1 ? '' : 's'}?`)) return;
    cards = cards.filter((item) => !selectedIds.has(item.id));
    if (editingId && selectedIds.has(editingId)) {
      editingId = null;
      if (sourceEl) sourceEl.value = '';
      fitCompose();
      setEnterLabel();
    }
    selectedIds.clear();
    renderCards();
    applyViewLang();
    persistNote().catch((error) => {
      setStatus(error.message || 'Could not delete cards.');
    });
  }

  function removeCard(id) {
    const block = cards.find((item) => item.id === id);
    if (!block) return;
    const label = stripTags(block.source || '').trim().slice(0, 40) || 'this card';
    if (!window.confirm(`Delete “${label}”?`)) return;
    cards = cards.filter((item) => item.id !== id);
    selectedIds.delete(id);
    if (editingId === id) {
      editingId = null;
      if (sourceEl) sourceEl.value = '';
      fitCompose();
      setEnterLabel();
      setStatus('');
    }
    renderCards();
    persistNote().catch((error) => {
      setStatus(error.message || 'Could not delete card.');
    });
  }

  function beginEdit(id) {
    const block = cards.find((item) => item.id === id);
    if (!block) return;
    if (editingId === id) {
      editingId = null;
      if (sourceEl) sourceEl.value = '';
      fitCompose();
      renderCards();
      setEnterLabel();
      setStatus('');
      return;
    }
    editingId = id;
    insertTarget = 'body';
    if (sourceEl) {
      sourceEl.value = block.source || '';
      sourceEl.lang = langById(block.lang || getLanguage()).htmlLang;
      fitCompose();
      sourceEl.focus({ preventScroll: true });
      const pos = sourceEl.value.length;
      caret = { start: pos, end: pos };
      sourceEl.setSelectionRange(pos, pos);
    }
    renderCards();
    setEnterLabel();
    setStatus('Editing this card. Tap Enter to update.');
  }

  function setEnterLabel() {
    const button = document.getElementById('note-enter');
    if (!button || button.disabled) return;
    button.textContent = editingId ? 'Update' : 'Enter';
  }

  function renderCards() {
    if (!cardsEl) return;
    cardsEl.replaceChildren();
    for (const block of cards) {
      if (!stripTags(block.source || '').trim()) continue;
      cardsEl.append(cardNode(block));
    }
  }

  function reorderCards(from, to) {
    if (from === to || from < 0 || to < 0 || from >= cards.length || to > cards.length) return;
    const next = cards.slice();
    const [moved] = next.splice(from, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    cards = next;
    renderCards();
    applyViewLang();
    persistNote().catch((error) => {
      setStatus(error.message || 'Could not save card order.');
    });
  }

  function queueSave() {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      persistNote().catch(() => {});
    }, 400);
  }

  async function persistNote() {
    if (!currentNote || !hasOpenNote()) return;
    const seq = ++persistSeq;
    currentNote.title = titleEl?.value || '';
    currentNote.sourceLang = getLanguage();
    currentNote.blocks = cards.map((block) => ({
      id: block.id || newBlockId(),
      type: 'paragraph',
      source: stripTags(block.source || ''),
      lang: block.lang || getLanguage(),
      translations: { ...emptyTranslations(), ...(block.translations || {}) },
    }));
    const uid = userId();
    if (!uid) return;
    if (seq !== persistSeq) return;
    if (currentNote.local || String(currentNote.id || '').startsWith('local-')) {
      const oldId = currentNote.id;
      const sortOrder =
        typeof currentNote.sortOrder === 'number' && Number.isFinite(currentNote.sortOrder)
          ? currentNote.sortOrder
          : nextFrontSortOrder(notesCache);
      const id = await createNote(uid, {
        title: currentNote.title,
        sourceLang: currentNote.sourceLang,
        blocks: currentNote.blocks,
        sortOrder,
      });
      currentNote.id = id;
      currentNote.local = false;
      currentNote.sortOrder = sortOrder;
      const cached = notesCache.findIndex((note) => note.id === oldId);
      if (cached >= 0) {
        notesCache[cached] = { ...notesCache[cached], id, local: false, sortOrder };
      } else {
        notesCache = [{ ...currentNote }, ...notesCache];
      }
      return;
    }
    await saveNote(uid, currentNote.id, {
      title: currentNote.title,
      sourceLang: currentNote.sourceLang,
      blocks: currentNote.blocks,
    });
  }

  async function translateNote() {
    const source = stripTags(composeText()).trim();
    if (!source) {
      setStatus('Nothing to translate.');
      return;
    }
    const seq = ++translateSeq;
    const language = detectSourceLang(source, getLanguage());
    setStatus('Translating…');
    try {
      const data = await translate({ text: source, language });
      if (seq !== translateSeq) return;
      const mapped = translationsFromApi(source, language, data);
      const hasText = NOTE_LANGS.some(
        (key) => key !== mapped.fromLang && String(mapped.translations[key] || '').trim()
      );
      if (!hasText) throw new Error('Translation came back empty. Try Enter again.');
      const next = {
        id: editingId || newBlockId(),
        type: 'paragraph',
        source,
        lang: mapped.fromLang,
        translations: mapped.translations,
      };
      const index = editingId ? cards.findIndex((item) => item.id === editingId) : -1;
      if (index >= 0) cards[index] = next;
      else cards.push(next);
      editingId = null;
      if (sourceEl) sourceEl.value = '';
      fitCompose();
      renderCards();
      setEnterLabel();
      onHistory?.(source, data, mapped.fromLang);
      setStatus(index >= 0 ? 'Updated.' : '');
      await persistNote();
    } catch (error) {
      if (seq !== translateSeq) return;
      setStatus(error.message || 'Translation failed.');
    }
  }

  function rememberCaret() {
    if (!sourceEl) return;
    insertTarget = 'body';
    const start = sourceEl.selectionStart;
    const end = sourceEl.selectionEnd;
    if (typeof start === 'number') caret.start = start;
    if (typeof end === 'number') caret.end = end;
  }

  function rememberTitleCaret() {
    if (!titleEl) return;
    insertTarget = 'title';
    const start = titleEl.selectionStart;
    const end = titleEl.selectionEnd;
    if (typeof start === 'number') titleCaret.start = start;
    if (typeof end === 'number') titleCaret.end = end;
  }

  function insertIntoInput(el, stored, piece, maxLen) {
    const start = Math.min(stored.start, el.value.length);
    const end = Math.min(Math.max(stored.end, start), el.value.length);
    const before = el.value.slice(0, start);
    const after = el.value.slice(end);
    const needsSpace = before && !/\s$/.test(before) && !/^\s/.test(piece) && !/^[,.!?、。！？]/.test(piece);
    let insert = `${needsSpace && /[A-Za-z]/.test(piece) ? ' ' : ''}${piece}`;
    if (maxLen) {
      const room = Math.max(0, maxLen - (before.length + after.length));
      insert = [...insert].slice(0, room).join('');
    }
    if (!insert) return stored;
    el.value = `${before}${insert}${after}`;
    const pos = before.length + insert.length;
    try {
      el.setSelectionRange(pos, pos);
    } catch {
      // unfocused
    }
    return { start: pos, end: pos };
  }

  function insertAtCaret(text) {
    const piece = String(text ?? '');
    if (!piece) return;
    if (insertTarget === 'title' && titleEl) {
      titleCaret = insertIntoInput(titleEl, titleCaret, piece, 80);
      if (currentNote) currentNote.title = titleEl.value;
      window.clearTimeout(titleTimer);
      titleTimer = window.setTimeout(() => persistNote().catch(() => {}), 400);
      return;
    }
    if (!sourceEl) return;
    rememberCaret();
    caret = insertIntoInput(sourceEl, caret, piece);
    fitCompose();
  }

    async function submitTranslate() {
    const button = document.getElementById('note-enter');
    if (button) {
      button.disabled = true;
      button.textContent = 'Translating…';
    }
    hideKeyboard?.();
    try {
      await translateNote();
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = editingId ? 'Update' : 'Enter';
      }
    }
  }

  function insertFromComposer() {
    if (!isEditing()) return false;
    const text = stripTags(getPhrase());
    if (!text) return false;
    insertAtCaret(text);
    setPhrase('');
    return true;
  }

  async function commitFromComposer() {
    return insertFromComposer();
  }

  async function onCandidatePicked(value) {
    if (!isEditing()) return false;
    const piece = stripTags(value || '');
    if (!piece) return false;
    insertAtCaret(piece);
    setPhrase('');
    return true;
  }

  function mountEditor() {
    if (!editorHolder) return;
    editorHolder.replaceChildren();
    const compose = document.createElement('div');
    compose.className = 'note-compose';
    sourceEl = document.createElement('textarea');
    sourceEl.className = 'note-source';
    sourceEl.setAttribute('aria-label', 'Note');
    sourceEl.placeholder = 'Write here, then tap Enter.';
    sourceEl.spellcheck = false;
    sourceEl.lang = langById(getLanguage()).htmlLang;
    sourceEl.value = '';
    sourceEl.addEventListener('focus', rememberCaret);
    sourceEl.addEventListener('input', () => {
      rememberCaret();
      fitCompose();
    });
    sourceEl.addEventListener('click', rememberCaret);
    sourceEl.addEventListener('keyup', rememberCaret);
    sourceEl.addEventListener('select', rememberCaret);
    sourceEl.addEventListener('mouseup', rememberCaret);
    sourceEl.addEventListener('touchend', rememberCaret);
    sourceEl.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' || event.isComposing) return;
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault();
        submitTranslate();
      }
    });
    const submit = document.createElement('button');
    submit.type = 'button';
    submit.className = 'note-enter';
    submit.id = 'note-enter';
    submit.textContent = 'Enter';
    submit.setAttribute('aria-label', 'Translate into a card');
    submit.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (submit.disabled) return;
      submitTranslate();
    });
    submit.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    compose.append(sourceEl, submit);
    cardsEl = document.createElement('div');
    cardsEl.className = 'note-cards';
    editorHolder.append(compose, cardsEl);
    renderCards();
    fitCompose();
  }

  function destroyEditor() {
    window.clearTimeout(saveTimer);
    sourceEl = null;
    cardsEl = null;
    if (editorHolder) editorHolder.replaceChildren();
  }

  function paintNotesList(notes) {
    if (!listEl) return;
    if (!notes.length) {
      listEl.innerHTML = '<p class="empty-note">No notes yet. Tap New.</p>';
      return;
    }
    listEl.replaceChildren();
    for (const note of notes) {
      const row = document.createElement('div');
      row.className = 'notes-row';
      row.dataset.id = note.id;
      const handle = makeDragHandle('notes-handle', 'Reorder this note');
      bindReorderHandle(handle, {
        item: row,
        container: listEl,
        itemSelector: '.notes-row',
        onCommit: reorderNotes,
        onDragEnd: () => {
          suppressListClickUntil = Date.now() + 400;
        },
      });
      const open = document.createElement('button');
      open.type = 'button';
      open.className = 'notes-item';
      const title = document.createElement('div');
      title.className = 'notes-title';
      title.textContent = notePreview(note);
      const meta = document.createElement('div');
      meta.className = 'notes-meta';
      const count = (note.blocks || []).filter((block) => stripTags(block.source || '').trim()).length;
      meta.textContent = [noteWhen(note), count ? `${count} card${count === 1 ? '' : 's'}` : '']
        .filter(Boolean)
        .join('  ·  ');
      open.append(title, meta);
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'notes-delete';
      del.setAttribute('aria-label', 'Delete note');
      del.textContent = '✕';
      row.append(handle, open, del);
      listEl.append(row);
    }
  }

  function reorderNotes(from, to) {
    if (from === to || from < 0 || to < 0 || from >= notesCache.length || to > notesCache.length) return;
    const next = notesCache.slice();
    const [moved] = next.splice(from, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    next.forEach((note, index) => {
      note.sortOrder = index;
    });
    notesCache = next;
    paintNotesList(notesCache);
    const uid = userId();
    if (!uid) return;
    updateNoteOrder(
      uid,
      notesCache.map((note) => note.id)
    ).catch((error) => {
      setStatus(error.message || 'Could not save note order.');
    });
  }

  async function renderList() {
    if (!listEl) return;
    const uid = userId();
    if (!firebaseEnabled()) {
      listEl.innerHTML = '<p class="empty-note">Notes need Firebase to save.</p>';
      return;
    }
    if (!uid) {
      const localOnly = notesCache.filter(
        (note) => note.local || String(note.id || '').startsWith('local-')
      );
      if (localOnly.length) {
        notesCache = localOnly;
        paintNotesList(notesCache);
        return;
      }
      listEl.innerHTML = '<p class="empty-note">Sign in to write notes.</p>';
      return;
    }
    listEl.innerHTML = '<p class="empty-note">Loading…</p>';
    try {
      notesCache = await listNotes(uid);
      paintNotesList(notesCache);
    } catch (error) {
      listEl.innerHTML = `<p class="empty-note">${escapeHtml(error.message || 'Could not load notes.')}</p>`;
    }
  }

  function showList() {
    currentNote = null;
    cards = [];
    editingId = null;
    selectedIds.clear();
    if (listView) listView.hidden = false;
    if (editorView) editorView.hidden = true;
    setNoteOpenClass();
    destroyEditor();
    if (entered) renderList();
  }

  async function showEditor(note) {
    currentNote = note;
    cards = (note.blocks || [])
      .filter((block) => stripTags(block.source || '').trim())
      .map((block) => ({
        id: block.id || newBlockId(),
        type: 'paragraph',
        source: stripTags(block.source || ''),
        lang: block.lang || getLanguage(),
        translations: { ...emptyTranslations(), ...(block.translations || {}) },
      }));
    if (titleEl) titleEl.value = note.title || '';
    if (listView) listView.hidden = true;
    if (editorView) editorView.hidden = false;
    setNoteOpenClass();
    applyViewLang();
    insertTarget = 'body';
    mountEditor();
  }

  async function openNote(id) {
    if (String(id || '').startsWith('local-')) {
      const local = notesCache.find((note) => note.id === id) || currentNote;
      if (!local) {
        setStatus('Note not found.');
        showList();
        return;
      }
      await showEditor(local);
      return;
    }
    const uid = userId();
    if (!uid) {
      setStatus('Sign in with G to save notes to Firestore.');
      return;
    }
    const note = await getNote(uid, id);
    if (!note) {
      setStatus('Note not found.');
      showList();
      return;
    }
    await showEditor(note);
  }

  async function createAndOpen() {
    const uid = userId();
    const sortOrder = nextFrontSortOrder(notesCache);
    if (uid) {
      setStatus('Creating…');
      try {
        const id = await createNote(uid, {
          title: '',
          sourceLang: getLanguage(),
          blocks: [],
          sortOrder,
        });
        notesCache = [
          { id, title: '', sourceLang: getLanguage(), blocks: [], sortOrder },
          ...notesCache.filter((note) => note.id !== id),
        ];
        setStatus('');
        await openNote(id);
        return;
      } catch (error) {
        setStatus(error.message || 'Could not save to Firestore. Working locally.');
      }
    } else {
      setStatus('Working locally. Sign in with G to save.');
    }
    const local = {
      id: `local-${Date.now().toString(36)}`,
      title: '',
      sourceLang: getLanguage(),
      blocks: [],
      local: true,
      sortOrder,
    };
    notesCache = [local, ...notesCache.filter((note) => note.id !== local.id)];
    await showEditor(local);
  }

  async function removeCurrent() {
    if (!currentNote?.id) return;
    const uid = userId();
    const label = notePreview(currentNote);
    if (!window.confirm(`Delete “${label}”?`)) return;
    const id = currentNote.id;
    if (uid && !currentNote.local && !String(id).startsWith('local-')) {
      await deleteNote(uid, id);
    }
    notesCache = notesCache.filter((note) => note.id !== id);
    showList();
  }

  async function enter() {
    entered = true;
    if (pane) pane.hidden = false;
    if (!hasOpenNote()) showList();
    else if (listView) listView.hidden = true;
  }

  async function leave() {
    entered = false;
    if (currentNote?.id) {
      try {
        await persistNote();
      } catch {
        // keep local editor if save failed
      }
    }
    if (pane) pane.hidden = true;
  }

  function onAuth() {
    if (!entered) return;
    if (!userId()) {
      showList();
      return;
    }
    if (hasOpenNote() && !String(currentNote.id).startsWith('local-')) openNote(currentNote.id);
    else renderList();
  }

  document.getElementById('note-new')?.addEventListener('click', () => {
    createAndOpen();
  });
  document.getElementById('note-save')?.addEventListener('click', async () => {
    if (!hasOpenNote()) return;
    setStatus('Saving…');
    try {
      await persistNote();
      setStatus(userId() ? 'Saved.' : 'Saved locally. Sign in with G to keep it.');
    } catch (error) {
      setStatus(error.message || 'Could not save note.');
    }
  });
  document.getElementById('note-back')?.addEventListener('click', async () => {
    try {
      await persistNote();
    } catch {
      // still return to list
    }
    showList();
  });
  document.getElementById('note-delete')?.addEventListener('click', () => {
    removeCurrent();
  });
  titleEl?.addEventListener('focus', rememberTitleCaret);
  titleEl?.addEventListener('click', rememberTitleCaret);
  titleEl?.addEventListener('keyup', rememberTitleCaret);
  titleEl?.addEventListener('select', rememberTitleCaret);
  titleEl?.addEventListener('mouseup', rememberTitleCaret);
  titleEl?.addEventListener('touchend', rememberTitleCaret);
  titleEl?.addEventListener('input', () => {
    rememberTitleCaret();
    if (currentNote) currentNote.title = titleEl.value;
    window.clearTimeout(titleTimer);
    titleTimer = window.setTimeout(() => persistNote().catch(() => {}), 400);
  });
  titleEl?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      titleEl.blur();
    }
  });
  viewLangs?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-view-lang]');
    if (!button) return;
    const key = button.dataset.viewLang || 'all';
    if (key === 'all') {
      viewKeys = new Set(['all']);
    } else {
      viewKeys.delete('all');
      if (viewKeys.has(key)) viewKeys.delete(key);
      else viewKeys.add(key);
      if (!viewKeys.size) viewKeys.add('all');
    }
    applyViewLang();
    renderCards();
  });
  document.getElementById('note-delete-selected')?.addEventListener('click', () => {
    removeSelected();
  });
  listEl?.addEventListener('click', async (event) => {
    if (Date.now() < suppressListClickUntil) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const row = event.target.closest('.notes-row');
    if (!row) return;
    if (event.target.closest('.notes-handle')) return;
    if (event.target.closest('.notes-delete')) {
      const id = row.dataset.id;
      const label = row.querySelector('.notes-title')?.textContent || 'this note';
      if (!window.confirm(`Delete “${label}”?`)) return;
      const uid = userId();
      if (uid && id && !String(id).startsWith('local-')) await deleteNote(uid, id);
      notesCache = notesCache.filter((note) => note.id !== id);
      if (currentNote?.id === id) showList();
      else paintNotesList(notesCache);
      return;
    }
    openNote(row.dataset.id);
  });

  applyViewLang();

  return {
    enter,
    leave,
    isEditing,
    hasOpenNote,
    hasFocusedBlock: () => document.activeElement === sourceEl,
    onAuth,
    commitFromComposer,
    insertAtCaret,
    insertFromComposer,
    onCandidatePicked,
    persistNote,
    showList,
    renderList,
  };
}
