import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/main.scss'
import 'highlight.js/styles/github-dark.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
