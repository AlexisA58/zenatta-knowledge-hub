<template>
  <header class="topbar">
    <h1 class="topbar-title">{{ title }}</h1>

    <div class="topbar-actions">
      <slot name="actions" />
      <button v-if="showNewArticle" class="btn btn-primary btn-sm" @click="openCreate">
        <span class="mdi mdi-plus" />
        New Article
      </button>
      <div class="user-chip" :title="auth.email">
        <span class="user-initials">{{ initials }}</span>
      </div>
    </div>
  </header>
</template>

<script>
import { useAuth } from '@/composables/useAuth';
import { useArticleEditor } from '@/composables/useArticleEditor';

export default {
  name: 'TopBar',
  props: {
    title: {
      type: String,
      required: true,
    },
    showNewArticle: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    const { state } = useAuth();
    return { auth: state };
  },
  computed: {
    initials() {
      const name = this.auth.name || this.auth.email || '';
      return name
        .split(/[\s@.]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
    },
  },
  methods: {
    openCreate() {
      const { openCreate } = useArticleEditor();
      openCreate((article) => {
        this.$emit('article-saved', article);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 28px;
  border-bottom: 1px solid var(--zk-border);
  background: var(--zk-surface);
}

.topbar-title {
  font-size: 18px;
  font-weight: 700;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-chip {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--zk-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}
</style>
