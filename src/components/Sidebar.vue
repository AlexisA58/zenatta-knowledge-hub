<template>
  <aside class="sidebar">
    <router-link to="/" class="sidebar-brand">
      <span class="mdi mdi-book-open-page-variant-outline brand-icon" />
      <span class="brand-name">Zenatta Knowledge Hub</span>
    </router-link>

    <nav class="sidebar-nav">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="sidebar-link"
        exact
      >
        <span class="mdi" :class="item.icon" />
        <span>{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      navItems: [
        { to: '/', label: 'Home', icon: 'mdi-home-outline' },
        { to: '/customers', label: 'Customers', icon: 'mdi-domain' },
        { to: '/internal', label: 'Internal', icon: 'mdi-lock-outline' },
        { to: '/recently-updated', label: 'Recently Updated', icon: 'mdi-clock-outline' },
        { to: '/my-articles', label: 'My Articles', icon: 'mdi-account-outline' },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--zk-sidebar-bg);
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 12px;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
  margin-bottom: 28px;
  text-decoration: none;
  color: var(--zk-sidebar-text-active);

  .brand-icon {
    font-size: 22px;
  }

  .brand-name {
    font-size: 15px;
    font-weight: 700;
    line-height: 1.2;
  }
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--zk-radius-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--zk-sidebar-text);
  text-decoration: none;
  transition: background-color 0.15s ease, color 0.15s ease;

  .mdi {
    font-size: 18px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: var(--zk-sidebar-text-active);
  }

  &.router-link-active {
    background: rgba(255, 255, 255, 0.1);
    color: var(--zk-sidebar-text-active);
  }
}
</style>
