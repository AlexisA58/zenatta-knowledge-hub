<template>
  <router-link :to="`/articles/${article.id}`" class="article-card">
    <div class="article-card-header">
      <span class="badge" :class="knowledgeTypeBadgeClass">{{ article.knowledgeType }}</span>
      <span class="badge" :class="statusBadgeClass">{{ article.status }}</span>
    </div>

    <h3 class="article-card-title">{{ article.title }}</h3>
    <p class="article-card-summary">{{ article.summary }}</p>

    <div class="article-card-meta">
      <span v-if="article.project" class="meta-item">
        <span class="mdi mdi-folder-outline" />{{ article.project }}
      </span>
    </div>

    <div v-if="article.tags.length" class="article-card-tags">
      <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>

    <div class="article-card-footer">
      <span>{{ article.author }}</span>
      <span>{{ formatRelativeTime(article.modifiedTime) }}</span>
    </div>
  </router-link>
</template>

<script>
import { formatRelativeTime } from '@/utils/formatDate';

export default {
  name: 'ArticleCard',
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  computed: {
    knowledgeTypeBadgeClass() {
      return this.article.knowledgeType === 'Customer' ? 'badge-customer' : 'badge-internal';
    },
    statusBadgeClass() {
      return `badge-status-${(this.article.status || '').toLowerCase()}`;
    },
  },
  methods: {
    formatRelativeTime,
  },
};
</script>

<style lang="scss" scoped>
.article-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--zk-surface);
  border: 1px solid var(--zk-border);
  border-radius: var(--zk-radius-md);
  padding: 18px;
  text-decoration: none;
  color: var(--zk-text);
  transition: box-shadow 0.15s ease, border-color 0.15s ease;

  &:hover {
    box-shadow: var(--zk-shadow-md);
    border-color: transparent;
  }
}

.article-card-header {
  display: flex;
  gap: 6px;
}

.article-card-title {
  font-size: 15px;
  font-weight: 700;
}

.article-card-summary {
  font-size: 13px;
  color: var(--zk-text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card-meta {
  display: flex;
  gap: 14px;
  font-size: 12px;
  color: var(--zk-text-muted);

  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .mdi {
    font-size: 14px;
  }
}

.article-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.article-card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--zk-text-muted);
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid var(--zk-border);
}
</style>
