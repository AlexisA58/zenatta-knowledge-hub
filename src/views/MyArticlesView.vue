<template>
  <div class="view">
    <TopBar title="My Articles" @article-saved="fetch" />
    <div class="view-body">
      <div class="controls-row">
        <SearchBar v-model="search" placeholder="Search my articles..." />
      </div>

      <ArticleList
        :articles="visibleArticles"
        :loading="state.loading"
        :error="state.error"
        empty-title="You haven't written any articles yet"
        empty-message="Articles you author will show up here."
        @retry="fetch"
      />
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue';
import SearchBar from '@/components/SearchBar.vue';
import ArticleList from '@/components/ArticleList.vue';
import { useArticles } from '@/composables/useArticles';
import { useAuth } from '@/composables/useAuth';
import { matchesFilters } from '@/utils/articleFilters';

export default {
  name: 'MyArticlesView',
  components: { TopBar, SearchBar, ArticleList },
  data() {
    const { state, load } = useArticles();
    return { state, load, search: '' };
  },
  computed: {
    visibleArticles() {
      return this.state.articles.filter((article) => matchesFilters(article, { search: this.search }));
    },
  },
  async created() {
    await this.fetch();
  },
  methods: {
    async fetch() {
      const { state: authState, init } = useAuth();
      await init();
      this.load({ authorEmail: authState.email, sort: 'newest' });
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

.view-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
}

.controls-row {
  margin-bottom: 20px;
}
</style>
