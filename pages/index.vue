<template>
  <div class="container p-3">
    <div class="block">
      <feed-input></feed-input>
      <div v-if="stories && stories.length > 0">
        
        <stories :stories="Object.assign({}, stories)" />
      </div>
    </div>

    <div class="columns is-multiline">
      <div
        class="column is-flex is-4 p-0"
        v-for="item in items"
        :key="item.link"
      >
        <card :article="item" />
      </div>
    </div>

    <!-- <nav
      class="pagination is-centered"
      role="navigation"
      aria-label="pagination"
    >
      <a class="pagination-previous">Previous</a>
      <a class="pagination-next">Next page</a>
    </nav> -->
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  async mounted() {
    await this.$store.dispatch("feeds/fetchAll");
    await this.$store.dispatch("feeds/fetchStories");
  },
  computed: {
    ...mapState({
      items: ({ feeds: { items } }) => items.list,
      stories: ({ feeds }) => feeds.stories,
    }),
  },
};
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
}
</style>
