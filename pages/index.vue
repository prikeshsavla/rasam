<template>
  <main>
    <navbar />

    <div class="container p-3">
      <div class="block">
        <!-- <    feed-input></feed-input> -->
        <div v-if="stories && stories.length > 0">
          <stories :stories="stories" />
        </div>

        <nuxt-link
          class="button is-primary is-outlined is-fullwidth is-small"
          to="play-stories"
          >Alt Stories</nuxt-link
        >
      </div>

      <div class="columns is-multiline">
        <div
          v-for="item in items"
          :key="item.link"
          class="column is-flex is-4 p-0"
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
  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  async fetch() {
    await this.$store.dispatch('feeds/fetchStories')
    await this.$store.dispatch('feeds/fetchAll')
  },
  computed: {
    ...mapState({
      items: ({ feeds: { items } }) => items.list,
      stories: ({ feeds }) => feeds.stories,
    }),
  },
}
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
