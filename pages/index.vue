<template>
  <v-container>
    <v-app-bar app dense elevate-on-scroll color="accent">
      <v-app-bar-title class="black--text"> Rasam </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-progress-circular
        v-if="loading"
        :size="20"
        :width="2"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </v-app-bar>
    <div class="block mb-4">
      <!-- <search-input></search-input> -->
      <story-timeline :stories="stories" />
    </div>
    <v-divider class="mb-4" />
    <article-list :items="items" class="mb-5" @nextPage="nextPage" />
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
    const feeds = await this.$store.dispatch('feeds/fetchFeedsOnly')
    if (!feeds.length) {
      this.$router.push('/onboarding')
    }
  },

  computed: {
    ...mapGetters({
      items: 'items/paginatedList',
    }),
    ...mapState({
      stories: ({ stories }) => stories.list,
      loading: ({ settings }) => settings.loading,
    }),
  },
  async mounted() {
    await this.$store.dispatch('stories/fetchAll')
    await this.$store.dispatch('feeds/fetchAll')
  },

  methods: {
    ...mapActions({
      nextPage: 'items/nextPage',
    }),
  },
}
</script>

<style></style>
