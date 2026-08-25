<template>
  <div class="app-shell">
    <Sidebar />
    <main class="app-main">
      <router-view />
    </main>
    <ArticleEditor />
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import ArticleEditor from '@/components/ArticleEditor.vue';
import { useAuth } from '@/composables/useAuth';

export default {
  name: 'App',
  components: { Sidebar, ArticleEditor },
  created() {
    const { init } = useAuth();
    init();
  },
};
</script>

<style lang="scss">
.app-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.app-main {
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow: hidden;
}
</style>
