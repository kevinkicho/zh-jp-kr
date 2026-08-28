import { detectSourceLang, translate } from './api.js';
import { firebaseEnabled } from './firebase.js';
import { NoteParagraph } from './note-block.js';
import {
  createNote,
  deleteNote,
  emptyTranslations,
  getNote,
  listNotes,
  notePreview,
  noteWhen,
  saveNote,
  stripTags,
  translationsFromApi,
} from './notes.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function plainListSource(items) {
  return (items || [])
    .map((item) => stripTags(typeof item === 'string' ? item : item?.content || item?.text || ''))
    .filter(Boolean)
    .join('\n');
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
}) {
  const pane = document.getElementById('notes-pane');
  const listView = document.getElementById('notes-list-view');
  const editorView = document.getElementById('note-editor-view');
  const listEl = document.getElementById('notes-list');
  const titleEl = document.getElementById('note-title');
  const editorHolder = document.getElementById('note-editor');
  const viewLangs = document.getElementById('note-view-langs');

  let editor = null;
  let editorMods = null;
  let tools = [];
  let toolsById = new Map();
  let currentNote = null;
  let viewLang = 'all';
  let saveTimer = 0;
  let titleTimer = 0;
  let persistSeq = 0;
  let translateSeq = 0;
  let committing = false;
  let entered = false;
  let lastCommitStamp = '';

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

  function applyViewLang() {
    if (editorView) editorView.dataset.viewLang = viewLang;
    if (!viewLangs) return;
    viewLangs.querySelectorAll('[data-view-lang]').forEach((button) => {
      button.setAttribute('aria-selected', String(button.dataset.viewLang === viewLang));
    });
  }

  function rememberTool(tool) {
    if (!tool) return;
    if (!tools.includes(tool)) tools.push(tool);
    if (tool.blockId) toolsById.set(tool.blockId, tool);
  }

  async function loadEditorMods() {
    if (editorMods) return editorMods;
    const [{ default: EditorJS }, { default: Header }, { default: EditorjsList }] = await Promise.all([
      import('@editorjs/editorjs'),
      import('@editorjs/header'),
      import('@editorjs/list'),
    ]);
    editorMods = { EditorJS, Header, EditorjsList };
    return editorMods;
  }

  function toolConfig() {
    return {
      defaultLang: getLanguage(),
      onCreate(tool) {
        rememberTool(tool);
      },
      onDirty() {
        queueSave();
      },
      onFocusBlock(tool) {
        rememberTool(tool);
        const live = stripTags(getPhrase()).trim();
        const source = stripTags(tool.data?.source || '').trim();
        if (live && live !== source) return;
        tools.forEach((item) => item.setSelected(item === tool));
        if (source) setPhrase(source);
      },
      onCommitBlock(tool) {
        rememberTool(tool);
        commitTool(tool);
      },
      onRequestNewBlock() {
        if (!editor) return;
        editor.blocks.insert('noteParagraph', {
          source: '',
          lang: getLanguage(),
          translations: emptyTranslations(),
        });
      },
    };
  }

  async function ensureEditor(blocks) {
    await destroyEditor();
    tools = [];
    toolsById = new Map();
    const { EditorJS, Header, EditorjsList } = await loadEditorMods();
    editor = new EditorJS({
      holder: editorHolder,
      minHeight: 80,
      autofocus: false,
      defaultBlock: 'noteParagraph',
      placeholder: 'Type here, or draw below and tap a suggestion.',
      data: { blocks: blocks || [] },
      tools: {
        noteParagraph: {
          class: NoteParagraph,
          config: toolConfig(),
        },
        header: {
          class: Header,
          config: { levels: [2, 3], defaultLevel: 2 },
        },
        list: {
          class: EditorjsList,
          inlineToolbar: false,
        },
      },
      onReady() {
        collectTools();
      },
      onChange() {
        collectTools();
        queueSave();
      },
    });
    await editor.isReady;
    collectTools();
  }

  function collectTools() {
    editorHolder?.querySelectorAll('.note-block').forEach((node) => {
      // Tools keep themselves in toolsById from constructor/focus.
    });
  }

  async function destroyEditor() {
    if (!editor) return;
    const current = editor;
    editor = null;
    tools = [];
    toolsById = new Map();
    try {
      await current.isReady;
    } catch {
      // ignore init failures
    }
    try {
      current.destroy();
    } catch {
      // ignore
    }
    if (editorHolder) editorHolder.replaceChildren();
  }

  function blocksToEditor(blocks) {
    return (blocks || []).map((block) => {
      if (block.type === 'header') {
        return {
          id: block.id,
          type: 'header',
          data: { text: stripTags(block.source || ''), level: 2 },
        };
      }
      if (block.type === 'list') {
        const items = stripTags(block.source || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean);
        return {
          id: block.id,
          type: 'list',
          data: { style: 'unordered', items: items.length ? items : [''] },
        };
      }
      return {
        id: block.id,
        type: 'noteParagraph',
        data: {
          source: stripTags(block.source || ''),
          lang: block.lang || getLanguage(),
          translations: { ...emptyTranslations(), ...(block.translations || {}) },
        },
      };
    });
  }

  async function editorToBlocks() {
    if (!editor) return currentNote?.blocks || [];
    const saved = await editor.save();
    const mapped = (saved.blocks || []).map((block) => {
      if (block.type === 'header') {
        const existing = (currentNote?.blocks || []).find((item) => item.id === block.id);
        return {
          id: block.id,
          type: 'header',
          source: stripTags(block.data?.text || ''),
          lang: existing?.lang || getLanguage(),
          translations: { ...emptyTranslations(), ...(existing?.translations || {}) },
        };
      }
      if (block.type === 'list') {
        const existing = (currentNote?.blocks || []).find((item) => item.id === block.id);
        return {
          id: block.id,
          type: 'list',
          source: plainListSource(block.data?.items || []),
          lang: existing?.lang || getLanguage(),
          translations: { ...emptyTranslations(), ...(existing?.translations || {}) },
        };
      }
      const data = block.data || {};
      return {
        id: block.id,
        type: 'paragraph',
        source: stripTags(data.source || data.text || ''),
        lang: data.lang || getLanguage(),
        translations: { ...emptyTranslations(), ...(data.translations || {}) },
      };
    });
    return mapped.filter((block) => stripTags(block.source || '').trim());
  }

  function queueSave() {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      persistNote().catch(() => {});
    }, 450);
  }

  async function persistNote() {
    const uid = userId();
    if (!uid || !currentNote?.id || !editor) return;
    const seq = ++persistSeq;
    const blocks = await editorToBlocks();
    if (seq !== persistSeq) return;
    currentNote.blocks = blocks;
    currentNote.title = titleEl?.value || '';
    currentNote.sourceLang = getLanguage();
    await saveNote(uid, currentNote.id, {
      title: currentNote.title,
      sourceLang: currentNote.sourceLang,
      blocks,
    });
  }

  async function commitTool(tool) {
    if (!tool || committing) return;
    tool.syncFromDom?.();
    const source = stripTags(tool.data?.source || '').trim();
    if (!source || !tool.needsTranslate?.()) return;
    const seq = ++translateSeq;
    const language = detectSourceLang(source, tool.data.lang || getLanguage());
    tool.setTranslating(true);
    setStatus('Translating…');
    try {
      const data = await translate({ text: source, language });
      if (seq !== translateSeq) return;
      const mapped = translationsFromApi(source, language, data);
      tool.setTranslations(mapped.translations, mapped.fromLang);
      setStatus('');
      queueSave();
    } catch (error) {
      tool.setTranslating(false);
      setStatus(error.message || 'Translation failed.');
    }
  }

  function focusedSource() {
    const active = document.activeElement;
    if (active?.classList?.contains('note-source')) return active;
    return editorHolder?.querySelector('.ce-block--focused .note-source') || null;
  }

  function toolForSource(el) {
    if (!el) return null;
    for (const tool of tools) {
      if (tool.sourceEl === el || tool.wrapper?.contains(el)) return tool;
    }
    return null;
  }

  function selectedTool() {
    return tools.find((item) => item.selected) || toolForSource(focusedSource());
  }

  async function insertParagraph(source, lang, translations) {
    if (!editor) return null;
    await editor.isReady;
    const index = editor.blocks.getBlocksCount();
    editor.blocks.insert(
      'noteParagraph',
      {
        source,
        lang,
        translations: translations || emptyTranslations(),
      },
      undefined,
      index,
      true
    );
    collectTools();
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    return tools.at(-1) || [...toolsById.values()].at(-1) || null;
  }

  async function commitFromComposer({ fromCandidate = false } = {}) {
    if (!isEditing()) return false;
    const text = stripTags(getPhrase()).trim();
    if (!text) return false;
    const language = detectSourceLang(text, getLanguage());
    const stamp = `${currentNote.id}:${language}:${text}`;
    if (stamp === lastCommitStamp) return false;
    lastCommitStamp = stamp;
    committing = true;
    hideKeyboard?.();
    setStatus('Translating…');
    try {
      const target = selectedTool();
      const data = await translate({ text, language });
      const mapped = translationsFromApi(text, language, data);

      if (target) {
        target.setSource(text, mapped.fromLang);
        target.setTranslations(mapped.translations, mapped.fromLang);
        target.setSelected(false);
      } else {
        const created = await insertParagraph(text, mapped.fromLang, mapped.translations);
        if (created) {
          created.setSource(text, mapped.fromLang);
          created.setTranslations(mapped.translations, mapped.fromLang);
          rememberTool(created);
        }
      }
      tools.forEach((item) => item.setSelected(false));
      setPhrase('');
      setStatus('');
      queueSave();
      return true;
    } catch (error) {
      lastCommitStamp = '';
      setStatus(error.message || 'Translation failed.');
      return false;
    } finally {
      committing = false;
    }
  }

  async function onCandidatePicked(value) {
    if (!isEditing()) return false;
    const piece = stripTags(value || '');
    if (!piece) return false;
    const focused = focusedSource();
    if (focused) {
      const tool = toolForSource(focused);
      if (tool) {
        tool.appendSource(piece);
        await commitTool(tool);
        setPhrase('');
        return true;
      }
    }
    const next = `${stripTags(getPhrase())}`;
    if (!next.trim()) return false;
    return commitFromComposer({ fromCandidate: true });
  }

  async function renderList() {
    if (!listEl) return;
    const uid = userId();
    if (!firebaseEnabled()) {
      listEl.innerHTML = '<p class="empty-note">Notes need Firebase to save.</p>';
      return;
    }
    if (!uid) {
      listEl.innerHTML = '<p class="empty-note">Sign in to write notes.</p>';
      return;
    }
    listEl.innerHTML = '<p class="empty-note">Loading…</p>';
    try {
      const notes = await listNotes(uid);
      if (!notes.length) {
        listEl.innerHTML = '<p class="empty-note">No notes yet. Tap New.</p>';
        return;
      }
      listEl.replaceChildren();
      for (const note of notes) {
        const row = document.createElement('div');
        row.className = 'notes-row';
        row.dataset.id = note.id;
        const open = document.createElement('button');
        open.type = 'button';
        open.className = 'notes-item';
        const title = document.createElement('div');
        title.className = 'notes-title';
        title.textContent = notePreview(note);
        const meta = document.createElement('div');
        meta.className = 'notes-meta';
        const count = (note.blocks || []).filter((block) => stripTags(block.source || '').trim()).length;
        meta.textContent = [noteWhen(note), count ? `${count} line${count === 1 ? '' : 's'}` : '']
          .filter(Boolean)
          .join('  ·  ');
        open.append(title, meta);
        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'notes-delete';
        del.setAttribute('aria-label', 'Delete note');
        del.textContent = '✕';
        row.append(open, del);
        listEl.append(row);
      }
    } catch (error) {
      listEl.innerHTML = `<p class="empty-note">${escapeHtml(error.message || 'Could not load notes.')}</p>`;
    }
  }

  function showList() {
    currentNote = null;
    if (listView) listView.hidden = false;
    if (editorView) editorView.hidden = true;
    setNoteOpenClass();
    destroyEditor();
    if (entered) renderList();
  }

  async function openNote(id) {
    const uid = userId();
    if (!uid) {
      setStatus('Sign in to write notes.');
      return;
    }
    const note = await getNote(uid, id);
    if (!note) {
      setStatus('Note not found.');
      showList();
      return;
    }
    currentNote = note;
    if (titleEl) titleEl.value = note.title || '';
    if (listView) listView.hidden = true;
    if (editorView) editorView.hidden = false;
    setNoteOpenClass();
    applyViewLang();
    await ensureEditor(blocksToEditor(note.blocks || []));
  }

  async function createAndOpen() {
    const uid = userId();
    if (!uid) {
      setStatus('Sign in to write notes.');
      return;
    }
    setStatus('Creating…');
    try {
      const id = await createNote(uid, { title: '', sourceLang: getLanguage(), blocks: [] });
      setStatus('');
      await openNote(id);
    } catch (error) {
      setStatus(error.message || 'Could not create note.');
    }
  }

  async function removeCurrent() {
    const uid = userId();
    if (!uid || !currentNote?.id) return;
    const label = notePreview(currentNote);
    if (!window.confirm(`Delete “${label}”?`)) return;
    await deleteNote(uid, currentNote.id);
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
    if (hasOpenNote()) openNote(currentNote.id);
    else renderList();
  }

  document.getElementById('note-new')?.addEventListener('click', () => {
    createAndOpen();
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
  titleEl?.addEventListener('input', () => {
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
    viewLang = button.dataset.viewLang || 'all';
    applyViewLang();
  });
  listEl?.addEventListener('click', async (event) => {
    const row = event.target.closest('.notes-row');
    if (!row) return;
    if (event.target.closest('.notes-delete')) {
      const uid = userId();
      if (!uid) return;
      const label = row.querySelector('.notes-title')?.textContent || 'this note';
      if (!window.confirm(`Delete “${label}”?`)) return;
      await deleteNote(uid, row.dataset.id);
      if (currentNote?.id === row.dataset.id) showList();
      else renderList();
      return;
    }
    if (event.target.closest('.notes-item')) openNote(row.dataset.id);
  });

  applyViewLang();

  function hasFocusedBlock() {
    return Boolean(focusedSource());
  }

  return {
    enter,
    leave,
    isEditing,
    hasOpenNote,
    hasFocusedBlock,
    onAuth,
    commitFromComposer,
    onCandidatePicked,
    persistNote,
  };
}
