<template>
  <div class="search-bar">
    <span class="mdi mdi-magnify" />
    <input
      type="text"
      class="search-input"
      :placeholder="placeholder"
      :value="value"
      @input="onInput"
    >
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Search articles...',
    },
    debounceMs: {
      type: Number,
      default: 250,
    },
  },
  data() {
    return { timer: null };
  },
  methods: {
    onInput(event) {
      const query = event.target.value;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$emit('input', query);
      }, this.debounceMs);
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
};
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--zk-surface);
  border: 1px solid var(--zk-border);
  border-radius: var(--zk-radius-md);
  padding: 10px 14px;

  .mdi {
    color: var(--zk-text-muted);
    font-size: 18px;
  }
}

.search-input {
  border: none;
  outline: none;
  font-size: 14px;
  width: 100%;
  color: var(--zk-text);
  background: transparent;
}
</style>
