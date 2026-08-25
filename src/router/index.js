import Vue from 'vue';
import VueRouter from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import CustomersView from '@/views/CustomersView.vue';
import InternalView from '@/views/InternalView.vue';
import RecentlyUpdatedView from '@/views/RecentlyUpdatedView.vue';
import MyArticlesView from '@/views/MyArticlesView.vue';
import ArticleView from '@/views/ArticleView.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/customers', name: 'customers', component: CustomersView },
  { path: '/internal', name: 'internal', component: InternalView },
  { path: '/recently-updated', name: 'recently-updated', component: RecentlyUpdatedView },
  { path: '/my-articles', name: 'my-articles', component: MyArticlesView },
  { path: '/articles/:id', name: 'article-detail', component: ArticleView, props: true },
];

// Hash mode: the widget is served from a static /app folder inside the
// Creator/ZET host, so there is no server-side route handling to rely on.
const router = new VueRouter({
  mode: 'hash',
  routes,
});

export default router;
