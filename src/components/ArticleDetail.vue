<template>
  <article class="article-detail">
    <header class="article-detail-header">
      <div class="badges">
        <span class="badge" :class="knowledgeTypeBadgeClass">{{ article.knowledgeType }}</span>
        <span class="badge" :class="statusBadgeClass">{{ article.status }}</span>
      </div>

      <div class="title-row">
        <h1>{{ article.title }}</h1>
        <div class="title-actions">
          <button class="btn btn-secondary btn-sm" @click="$emit('edit')">
            <span class="mdi mdi-pencil-outline" />
            Edit
          </button>
          <button v-if="canDelete" class="btn btn-secondary btn-sm btn-danger" @click="confirmDelete">
            <span class="mdi mdi-trash-can-outline" />
            Delete
          </button>
        </div>
      </div>

      <p v-if="article.summary" class="summary">{{ article.summary }}</p>

      <div class="meta-row">
        <span v-if="article.project" class="meta-item">
          <span class="mdi mdi-folder-outline" />{{ article.project }}
        </span>
        <span class="meta-item">
          <span class="mdi mdi-account-outline" />{{ article.author }}
        </span>
        <span class="meta-item">
          <span class="mdi mdi-calendar-plus-outline" />Created {{ formatDate(article.createdTime) }}
        </span>
        <span class="meta-item">
          <span class="mdi mdi-calendar-edit-outline" />Updated {{ formatDate(article.modifiedTime) }}
        </span>
      </div>

      <div v-if="article.tags.length" class="tags-row">
        <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>

      <div v-if="hasLinks" class="links-row">
        <a v-if="article.loomUrl" class="btn btn-secondary btn-sm" :href="article.loomUrl" target="_blank" rel="noopener">
          <span class="mdi mdi-play-circle-outline" />Watch on Loom
        </a>
        <a v-if="article.githubUrl" class="btn btn-secondary btn-sm" :href="article.githubUrl" target="_blank" rel="noopener">
          <span class="mdi mdi-github" />View on GitHub
        </a>
        <a v-if="article.relatedUrl" class="btn btn-secondary btn-sm" :href="article.relatedUrl" target="_blank" rel="noopener">
          <span class="mdi mdi-open-in-new" />Related Link
        </a>
      </div>
    </header>

    <div ref="content" class="rich-content" v-html="article.content" />
  </article>
</template>

<script>
import { formatDate } from '@/utils/formatDate';
import { highlightCodeBlocks, addCopyButtons } from '@/utils/highlightCode';
import { useAuth } from '@/composables/useAuth';
import { isOwner } from '@/utils/articleFilters';

export default {
  name: 'ArticleDetail',
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    const { state } = useAuth();
    return { auth: state };
  },
  computed: {
    knowledgeTypeBadgeClass() {
      return this.article.knowledgeType === 'Customer' ? 'badge-customer' : 'badge-internal';
    },
    statusBadgeClass() {
      return `badge-status-${(this.article.status || '').toLowerCase()}`;
    },
    hasLinks() {
      return !!(this.article.loomUrl || this.article.githubUrl || this.article.relatedUrl);
    },
    // Only the article's own creator can delete it — compares the logged-in
    // user's exact email against the ownerEmail stamped at creation time.
    canDelete() {
      return isOwner(this.auth.email, this.article);
    },
  },
  mounted() {
    this.highlight();
  },
  updated() {
    this.highlight();
  },
  methods: {
    formatDate,
    highlight() {
      this.$nextTick(() => {
        highlightCodeBlocks(this.$refs.content);
        addCopyButtons(this.$refs.content);
      });
    },
    confirmDelete() {
      if (window.confirm(`Delete "${this.article.title}"? This cannot be undone.`)) {
        this.$emit('delete');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.article-detail {
  max-width: 820px;
  width: 100%;
  margin: 0 auto;
}

.article-detail-header {
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--zk-border);
}

.badges {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  h1 {
    font-size: 24px;
    font-weight: 700;
  }
}

.title-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.btn-danger {
  color: var(--zk-danger);

  &:hover:not(:disabled) {
    border-color: var(--zk-danger);
    color: var(--zk-danger);
    background: var(--zk-danger-bg);
  }
}

.summary {
  margin-top: 8px;
  font-size: 15px;
  color: var(--zk-text-muted);
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 14px;
  font-size: 13px;
  color: var(--zk-text-muted);

  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.links-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}
</style>
