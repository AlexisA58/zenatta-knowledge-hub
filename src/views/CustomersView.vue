<template>
  <KnowledgeTypeArticles
    knowledge-type="Customer"
    title="Customers"
    accent-class="view--customers"
  />
</template>

<script>
import KnowledgeTypeArticles from '@/components/KnowledgeTypeArticles.vue';

export default {
  name: 'CustomersView',
  components: { KnowledgeTypeArticles },
};
</script>
