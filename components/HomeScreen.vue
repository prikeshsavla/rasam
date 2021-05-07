<template>
  <v-container>
    <v-app-bar app dense elevate-on-scroll>
      <v-app-bar-title> Rasam </v-app-bar-title>
    </v-app-bar>
    <div class="block mb-4">
      <!-- <search-input></search-input> -->
      <story-timeline :stories="stories" />
    </div>
    <v-divider class="mb-4" />
    <article-list :items="items" @nextPage="nextPage" />
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      sheet: false,
    }
  },
  async fetch() {
    await this.$store.dispatch('stories/fetchAll')
    await this.$store.dispatch('feeds/fetchAll')
  },

  computed: {
    ...mapGetters({
      items: 'feeds/items/paginatedList',
    }),
    ...mapState({
      stories: ({ stories }) => stories.list,
    }),
  },

  methods: {
    ...mapActions({
      nextPage: 'feeds/items/nextPage',
    }),
  },
}
</script>
