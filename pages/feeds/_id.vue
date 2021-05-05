<template>
  <v-container>
    <v-app-bar app dense flat>
      <v-app-bar-nav-icon @click="back">
        <v-icon>mdi-chevron-left</v-icon>
      </v-app-bar-nav-icon>
    </v-app-bar>
    <div class="mb-3">
      <h1 class="title mt-2 mb-1">
        <a :href="feed.link">
          <strong>{{ feed.title }}</strong>
        </a>
      </h1>

      <p class="mb-2">
        {{ feed.description }}
      </p>
      <div class="d-flex align-center">
        <small>
          {{ feedLink }}
        </small>
        <v-spacer></v-spacer>
        <v-btn icon @click="shareFeed">
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </div>
    </div>

    <article-list class="mt-5" :items="items" @nextPage="nextPage" />
  </v-container>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import share from '@/plugins/share'

export default {
  async asyncData({ store, params }) {
    await store.dispatch('feeds/getFeed', params.id)
    await store.dispatch('feeds/items/fetchAllForFeed', params.id)
  },
  computed: {
    feedLink() {
      const url = new URL(this.feed.link)
      return url.href
        .replace('www.', '')
        .replace(/http(s):\/\//, '')
        .replace(/\/$/, '')
    },
    ...mapGetters({
      items: 'feeds/items/paginatedList',
    }),
    ...mapState({
      feed: ({ feeds }) => feeds.item,
    }),
  },
  methods: {
    back() {
      this.$router.back()
      window.history.back()
    },

    shareFeed() {
      let title = this.feed.title
      if (this.feed.description && this.feed.description.trim() !== '') {
        title += ' - ' + this.feed.description
      }
      share({
        title,
        text: title,
        url: this.feed.link,
      })
    },
    ...mapActions({
      nextPage: 'feeds/items/nextPage',
    }),
  },
}
</script>

<style></style>
