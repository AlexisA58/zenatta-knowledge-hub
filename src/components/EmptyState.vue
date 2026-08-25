<template>
  <div class="empty-state">
    <span class="mdi" :class="icon" />
    <h3>{{ title }}</h3>
    <p v-if="message">{{ message }}</p>
    <div v-if="$slots.action" class="empty-state-action">
      <slot name="action" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    icon: {
      type: String,
      default: 'mdi-file-document-outline',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 64px 24px;
  text-align: center;
  color: var(--zk-text-muted);

  .mdi {
    font-size: 40px;
    margin-bottom: 8px;
    opacity: 0.6;
  }

  h3 {
    color: var(--zk-text);
    font-size: 16px;
  }

  p {
    font-size: 14px;
    max-width: 360px;
  }
}

.empty-state-action {
  margin-top: 12px;
}
</style>
