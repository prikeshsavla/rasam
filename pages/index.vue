<template>
  <div class="container p-3">
    <div class="columns is-multiline">
      <card v-for="item in items" :key="item.link" :article="item" />
    </div>

    <nav
      class="pagination is-centered"
      role="navigation"
      aria-label="pagination"
    >
      <a class="pagination-previous">Previous</a>
      <a class="pagination-next">Next page</a>
    </nav>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  async beforeCreate() {
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
