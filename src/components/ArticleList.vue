<template>
  <div>
    <LoadingState v-if="loading" />
    <ErrorState
      v-else-if="error"
      :message="error"
      @retry="$emit('retry')"
    />
    <EmptyState
      v-else-if="!articles.length"
      icon="mdi-file-document-outline"
      :title="emptyTitle"
      :message="emptyMessage"
    />
    <div v-else class="article-grid">
      <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
    </div>
  </div>
</template>

<script>
import ArticleCard from '@/components/ArticleCard.vue';
import LoadingState from '@/components/LoadingState.vue';
import EmptyState from '@/components/EmptyState.vue';
import ErrorState from '@/components/ErrorState.vue';

export default {
  name: 'ArticleList',
  components: { ArticleCard, LoadingState, EmptyState, ErrorState },
  props: {
    articles: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: null,
    },
    emptyTitle: {
      type: String,
      default: 'No articles yet',
    },
    emptyMessage: {
      type: String,
      default: 'Once articles are added, they will show up here.',
    },
  },
};
</script>

<style lang="scss" scoped>
.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
</style>
