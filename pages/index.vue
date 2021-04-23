<template>
  <div class="container p-3">
    <div class="box">
      <feed-input></feed-input>
      <nuxt-link to="stories" class="button is-fullwidth is-primary is-outlined" prefetch
        >Stories</nuxt-link
      >
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
  },
  computed: {
    ...mapState({
      items: ({ feeds }) => feeds.items,
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
