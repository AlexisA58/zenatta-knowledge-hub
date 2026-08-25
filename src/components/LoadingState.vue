<template>
  <div class="loading-state">
    <div class="spinner" />
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingState',
  props: {
    message: {
      type: String,
      default: 'Loading...',
    },
  },
};
</script>

<style lang="scss" scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 64px 24px;
  color: var(--zk-text-muted);
  font-size: 14px;
}

.spinner {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid var(--zk-border);
  border-top-color: var(--zk-primary);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
