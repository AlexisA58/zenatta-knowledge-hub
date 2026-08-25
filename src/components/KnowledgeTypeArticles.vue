<template>
  <div class="view" :class="accentClass">
    <TopBar :title="title" @article-saved="fetch" />
    <div class="view-body">
      <div class="controls-row">
        <SearchBar v-model="filters.search" placeholder="Search articles..." />
        <FilterBar
          v-model="filters"
          :projects="projectOptions"
          :statuses="statusOptions"
          :tags="tagOptions"
        />
      </div>

      <ArticleList
        :articles="visibleArticles"
        :loading="state.loading"
        :error="state.error"
        empty-title="No articles found"
        empty-message="Try adjusting your search or filters."
        @retry="fetch"
      />
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue';
import SearchBar from '@/components/SearchBar.vue';
import FilterBar from '@/components/FilterBar.vue';
import ArticleList from '@/components/ArticleList.vue';
import { useArticles } from '@/composables/useArticles';
import { matchesFilters, sortArticles, uniqueOptions } from '@/utils/articleFilters';
import { ARTICLE_STATUS } from '@/config/creatorConfig';

export default {
  name: 'KnowledgeTypeArticles',
  components: { TopBar, SearchBar, FilterBar, ArticleList },
  props: {
    knowledgeType: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    accentClass: {
      type: String,
      default: '',
    },
  },
  data() {
    const { state, load } = useArticles();
    return {
      state,
      load,
      filters: {
        search: '', project: '', status: '', tag: '', sort: 'newest',
      },
      statusOptions: Object.values(ARTICLE_STATUS),
    };
  },
  computed: {
    projectOptions() {
      return uniqueOptions(this.state.articles, 'project');
    },
    tagOptions() {
      return uniqueOptions(this.state.articles, 'tags');
    },
    visibleArticles() {
      const filtered = this.state.articles.filter((article) => matchesFilters(article, this.filters));
      return sortArticles(filtered, this.filters.sort);
    },
  },
  watch: {
    knowledgeType: 'fetch',
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      this.load({ knowledgeType: this.knowledgeType });
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
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
}
</style>
