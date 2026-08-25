<template>
  <div class="view">
    <TopBar title="Recently Updated" @article-saved="fetch" />
    <div class="view-body">
      <div class="controls-row">
        <SearchBar v-model="search" placeholder="Search articles..." />
      </div>

      <ArticleList
        :articles="visibleArticles"
        :loading="state.loading"
        :error="state.error"
        empty-title="Nothing updated yet"
        empty-message="Recently modified articles will show up here."
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
import { matchesFilters } from '@/utils/articleFilters';

export default {
  name: 'RecentlyUpdatedView',
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
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      this.load({ sort: 'newest' });
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
