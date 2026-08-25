<template>
  <div class="view">
    <div class="view-body">
      <header class="hero">
        <div class="hero-brand">
          <span class="mdi mdi-book-open-page-variant-outline" />
          <h1>Zenatta Knowledge Hub</h1>
        </div>
        <p class="hero-subtitle">Search internal and customer documentation, integrations, and guides.</p>

        <div class="hero-search">
          <SearchBar v-model="search" placeholder="Search all articles..." />
          <button class="btn btn-primary" @click="openCreate">
            <span class="mdi mdi-plus" />
            New Article
          </button>
        </div>
      </header>

      <section class="quick-links">
        <router-link to="/customers" class="quick-link quick-link--customers">
          <span class="mdi mdi-domain" />
          <div>
            <h3>Customers</h3>
            <p>Client-facing projects and integrations</p>
          </div>
        </router-link>
        <router-link to="/internal" class="quick-link quick-link--internal">
          <span class="mdi mdi-lock-outline" />
          <div>
            <h3>Internal</h3>
            <p>Standards, deployment guides, and best practices</p>
          </div>
        </router-link>
      </section>

      <template v-if="search">
        <section class="section">
          <h2>Search Results</h2>
          <ArticleList
            :articles="searchResults"
            :loading="state.loading"
            :error="state.error"
            empty-title="No results"
            empty-message="Try a different search term."
            @retry="fetch"
          />
        </section>
      </template>

      <template v-else>
        <section class="section">
          <div class="section-header">
            <h2>Recently Updated</h2>
            <router-link to="/recently-updated" class="section-link">View all</router-link>
          </div>
          <ArticleList :articles="recentlyUpdated" :loading="state.loading" :error="state.error" @retry="fetch" />
        </section>

        <section class="section">
          <h2>Recent Articles</h2>
          <ArticleList :articles="recentArticles" :loading="state.loading" :error="state.error" @retry="fetch" />
        </section>
      </template>
    </div>
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue';
import ArticleList from '@/components/ArticleList.vue';
import { useArticles } from '@/composables/useArticles';
import { useArticleEditor } from '@/composables/useArticleEditor';
import { matchesFilters } from '@/utils/articleFilters';

export default {
  name: 'HomeView',
  components: { SearchBar, ArticleList },
  data() {
    const { state, load } = useArticles();
    return { state, load, search: '' };
  },
  computed: {
    recentlyUpdated() {
      return [...this.state.articles]
        .sort((a, b) => new Date(b.modifiedTime) - new Date(a.modifiedTime))
        .slice(0, 4);
    },
    recentArticles() {
      return [...this.state.articles]
        .sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime))
        .slice(0, 4);
    },
    searchResults() {
      return this.state.articles.filter((article) => matchesFilters(article, { search: this.search }));
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      this.load();
    },
    openCreate() {
      const { openCreate } = useArticleEditor();
      openCreate(() => this.fetch());
    },
  },
};
</script>

<style lang="scss" scoped>
.view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.view-body {
  flex: 1;
  overflow-y: auto;
  padding: 36px 28px;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
}

.hero {
  text-align: center;
  margin-bottom: 32px;
}

.hero-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;

  .mdi {
    font-size: 28px;
    color: var(--zk-primary);
  }

  h1 {
    font-size: 26px;
    font-weight: 800;
  }
}

.hero-subtitle {
  color: var(--zk-text-muted);
  font-size: 14px;
  margin-bottom: 20px;
}

.hero-search {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  max-width: 640px;
  margin: 0 auto;

  .search-bar {
    flex: 1;
    min-width: 220px;
  }
}

.quick-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 36px;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  border-radius: var(--zk-radius-lg);
  text-decoration: none;
  color: var(--zk-text);
  border: 1px solid var(--zk-border);
  background: var(--zk-surface);
  transition: box-shadow 0.15s ease;

  &:hover {
    box-shadow: var(--zk-shadow-md);
  }

  .mdi {
    font-size: 26px;
  }

  h3 {
    font-size: 15px;
    font-weight: 700;
  }

  p {
    font-size: 13px;
    color: var(--zk-text-muted);
  }
}

.quick-link--customers .mdi {
  color: var(--zk-customers);
}

.quick-link--internal .mdi {
  color: var(--zk-internal);
}

.section {
  margin-bottom: 32px;

  h2 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 14px;
  }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;

  h2 {
    margin-bottom: 0;
  }
}

.section-link {
  font-size: 13px;
  font-weight: 600;
  color: var(--zk-primary);
  text-decoration: none;
}
</style>
