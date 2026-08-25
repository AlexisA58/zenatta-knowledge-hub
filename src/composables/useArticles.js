import Vue from 'vue';
import { articlesService } from '@/services/articlesService';

// Factory, not a singleton: each view gets its own independent list/loading/error state.
export function useArticles() {
  const state = Vue.observable({
    articles: [],
    loading: false,
    error: null,
  });

  async function load(filters = {}) {
    state.loading = true;
    state.error = null;
    try {
      state.articles = await articlesService.listArticles(filters);
    } catch (err) {
      state.error = err.message || 'Could not load the articles.';
    } finally {
      state.loading = false;
    }
  }

  return { state, load };
}
