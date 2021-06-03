<template>
  <v-container>
    <v-app-bar app dense elevate-on-scroll color="primary">
      <v-app-bar-title class="white--text"> Rasam </v-app-bar-title>
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
  async fetch() {
    const onboarded = await this.$store.dispatch('settings/get', 'onboarded')
    if (!onboarded) {
      this.$router.push('/onboarding')
    }
  },
  data() {
    return {
      sheet: false,
    }
  },

  computed: {
    ...mapGetters({
      items: 'items/paginatedList',
    }),
    ...mapState({
      stories: ({ stories }) => stories.list,
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
