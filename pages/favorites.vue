<template>
  <v-container>
    <div class="text-center">
      <h1 class="mt-3">
        <v-icon color="primary">mdi-heart-multiple</v-icon> Favorites
        <v-icon color="primary">mdi-heart-multiple</v-icon>
      </h1>
      <p>All you favorite articles are here!</p>
    </div>
    <v-divider />
    <article-list
      class="mt-3 mb-5"
      :show-loader="false"
      :items="items"
      @nextPage="nextPage"
    />
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  async asyncData({ store }) {
    await store.dispatch('favorites/fetchAll', { onlyLiked: true })
  },
  computed: {
    ...mapGetters({
      items: 'favorites/paginatedList',
    }),
  },
  methods: {
    ...mapActions({
      nextPage: 'favorites/nextPage',
    }),
  },
}
</script>
