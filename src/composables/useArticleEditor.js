import Vue from 'vue';

// Global modal state so any view's "New Article" button, or an ArticleDetail's
// "Edit" button, can open the same ArticleEditor instance mounted once in App.vue.
const state = Vue.observable({
  isOpen: false,
  mode: 'create', // 'create' | 'edit'
  articleId: null,
  onSaved: null, // optional callback invoked with the saved article
});

function openCreate(onSaved) {
  state.mode = 'create';
  state.articleId = null;
  state.onSaved = onSaved || null;
  state.isOpen = true;
}

function openEdit(articleId, onSaved) {
  state.mode = 'edit';
  state.articleId = articleId;
  state.onSaved = onSaved || null;
  state.isOpen = true;
}

function close() {
  state.isOpen = false;
}

export function useArticleEditor() {
  return { state, openCreate, openEdit, close };
}
