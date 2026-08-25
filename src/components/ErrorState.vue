<template>
  <div class="error-state">
    <span class="mdi mdi-alert-circle-outline" />
    <h3>{{ title }}</h3>
    <p v-if="message">{{ message }}</p>
    <button class="btn btn-secondary btn-sm" @click="$emit('retry')">
      Try again
    </button>
  </div>
</template>

<script>
export default {
  name: 'ErrorState',
  props: {
    title: {
      type: String,
      default: 'Something went wrong',
    },
    message: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.error-state {
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
    color: var(--zk-danger);
  }

  h3 {
    color: var(--zk-text);
    font-size: 16px;
  }

  p {
    font-size: 14px;
    max-width: 360px;
    margin-bottom: 4px;
  }
}
</style>
