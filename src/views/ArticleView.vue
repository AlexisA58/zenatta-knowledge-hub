<template>
  <div class="view">
    <header class="view-topbar">
      <button class="btn btn-ghost btn-sm" @click="$router.go(-1)">
        <span class="mdi mdi-arrow-left" />
        Back
      </button>
    </header>

    <div class="view-body">
      <LoadingState v-if="loading" message="Loading article..." />
      <ErrorState v-else-if="error" :message="error" @retry="fetch" />
      <ArticleDetail v-else-if="article" :article="article" @edit="edit" @delete="remove" />
    </div>
  </div>
</template>

<script>
import ArticleDetail from '@/components/ArticleDetail.vue';
import LoadingState from '@/components/LoadingState.vue';
import ErrorState from '@/components/ErrorState.vue';
import { articlesService } from '@/services/articlesService';
import { useArticleEditor } from '@/composables/useArticleEditor';

export default {
  name: 'ArticleView',
  components: { ArticleDetail, LoadingState, ErrorState },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      article: null,
      loading: false,
      error: null,
    };
  },
  watch: {
    id: 'fetch',
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      this.error = null;
      try {
        this.article = await articlesService.getArticleById(this.id);
      } catch (err) {
        this.error = err.message || 'Could not load this article.';
      } finally {
        this.loading = false;
      }
    },
    edit() {
      const { openEdit } = useArticleEditor();
      openEdit(this.id, () => this.fetch());
    },
    async remove() {
      this.loading = true;
      try {
        await articlesService.deleteArticle(this.id);
        this.$router.push('/');
      } catch (err) {
        this.loading = false;
        this.error = err.message || 'Could not delete this article.';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.view-topbar {
  padding: 14px 28px;
  border-bottom: 1px solid var(--zk-border);
  background: var(--zk-surface);
}

.view-body {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
}
</style>
