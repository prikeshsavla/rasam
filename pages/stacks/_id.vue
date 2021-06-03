<template>
  <v-container>
    <v-app-bar app dense flat>
      <v-app-bar-nav-icon @click="back">
        <v-icon>mdi-arrow-left</v-icon>
      </v-app-bar-nav-icon>
    </v-app-bar>
    <div v-if="feed" class="mb-3">
      <h1 class="title mb-1">
        <strong>{{ feed.title }}</strong>
      </h1>

      <div class="mb-1" v-html="feed.description"></div>
      <div class="d-flex align-center">
        <a :href="feed.link" class="single-line-only">
          {{ feedLink }}
        </a>
        <v-spacer></v-spacer>
        <v-btn icon @click="shareFeed">
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </div>
    </div>
    <v-divider />

    <article-list class="mt-3 mb-5" :items="items" @nextPage="nextPage" />
  </v-container>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import share from '@/plugins/share'

export default {
  async asyncData({ store, params: { id } }) {
    await store.dispatch('feeds/getFeed', id)
    await store.dispatch('stackItems/fetchAll', { feedId: id })
  },
  computed: {
    feedLink() {
      const url = new URL(this.feed.link)
      return url.hostname
    },
    ...mapGetters({
      items: 'stackItems/paginatedList',
    }),
    ...mapState({
      feed: ({ feeds }) => feeds.item,
    }),
  },
  methods: {
    back() {
      // this.$router.back()
      if (window.history.length > 1) {
        window.history.back()
      } else {
        this.$router.push('/')
      }
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
      nextPage: 'stackItems/nextPage',
    }),
  },
}
</script>

<style></style>
