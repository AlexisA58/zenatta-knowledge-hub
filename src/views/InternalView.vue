<template>
  <KnowledgeTypeArticles
    knowledge-type="Internal"
    title="Internal"
    accent-class="view--internal"
  />
</template>

<script>
import KnowledgeTypeArticles from '@/components/KnowledgeTypeArticles.vue';

export default {
  name: 'InternalView',
  components: { KnowledgeTypeArticles },
};
</script>
