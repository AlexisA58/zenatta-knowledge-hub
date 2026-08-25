<template>
  <div class="filter-bar">
    <select class="select" :value="value.project" @change="update('project', $event.target.value)">
      <option value="">All Projects</option>
      <option v-for="project in projects" :key="project" :value="project">{{ project }}</option>
    </select>

    <select class="select" :value="value.status" @change="update('status', $event.target.value)">
      <option value="">All Statuses</option>
      <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
    </select>

    <select class="select" :value="value.tag" @change="update('tag', $event.target.value)">
      <option value="">All Tags</option>
      <option v-for="tag in tags" :key="tag" :value="tag">{{ tag }}</option>
    </select>

    <select class="select sort-select" :value="value.sort" @change="update('sort', $event.target.value)">
      <option value="newest">Newest first</option>
      <option value="oldest">Oldest first</option>
    </select>

    <button v-if="hasActiveFilters" class="btn btn-ghost btn-sm" @click="clear">
      Clear filters
    </button>
  </div>
</template>

<script>
export default {
  name: 'FilterBar',
  props: {
    value: {
      type: Object,
      required: true,
    },
    projects: { type: Array, default: () => [] },
    statuses: { type: Array, default: () => [] },
    tags: { type: Array, default: () => [] },
  },
  computed: {
    hasActiveFilters() {
      return !!(this.value.project || this.value.status || this.value.tag);
    },
  },
  methods: {
    update(key, val) {
      this.$emit('input', { ...this.value, [key]: val });
    },
    clear() {
      this.$emit('input', { ...this.value, project: '', status: '', tag: '' });
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.select {
  width: auto;
  min-width: 140px;
}

.sort-select {
  min-width: 150px;
}
</style>
