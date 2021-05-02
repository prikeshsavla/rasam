<template>
  <v-container>
    <v-app-bar app dense flat>
      <v-app-bar-nav-icon @click="back">
        <v-icon>mdi-chevron-left</v-icon>
      </v-app-bar-nav-icon>
      <v-app-bar-title @click="back">Back</v-app-bar-title>
    </v-app-bar>
    <small>
      <a :href="article.feedLink">
        {{ article.feedTitle }}
      </a>
    </small>
    <h1 class="headline mt-3">
      <a class="text-decoration-none" :href="article.link">
        {{ article.title }}</a
      >
    </h1>
    <small>
      {{ author }} ~<time-ago
        class="has-text-grey"
        :date="article.isoDate"
      ></time-ago
    ></small>
    <div class="content mt-4" v-html="content"></div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  async asyncData({ store, params: { id } }) {
    await store.dispatch('feeds/items/getItemByID', id)
  },
  computed: {
    feedLink() {
      const url = new URL(this.article.feedLink)
      return url.href
        .replace('www.', '')
        .replace(/http(s):\/\//, '')
        .replace(/\/$/, '')
    },
    content() {
      return this.article['content:encoded'] || this.article.content
    },
    author() {
      return (
        this.article.author || this.article.creator || this.article.feedTitle
      )
    },
    ...mapState({
      article: ({ feeds: { items } }) => items.item,
    }),
  },
  methods: {
    back() {
      this.$router.back()
      window.history.back()
    },
  },
}
</script>

<style>
.content {
  overflow-wrap: anywhere;
}
.content > * {
  max-width: 100%;
}
a {
  color: hsl(171, 100%, 41%);
}
figure {
  margin: 0 !important;
}
.content blockquote {
  padding: 1em;
  background: #f5f5f5;
  border-left: 3px grey solid;
}
.content hr {
  margin-top: 1em;
  margin-bottom: 1em;
}
.content p {
  margin-top: 0.5em;
}
.content img {
  height: auto;
  width: auto;
}

.content h1,
.content h2,
.content h3,
.content h4,
.content h5 {
  margin-top: 1em;
}

img {
  max-width: 100% !important;
  display: block !important;
}
</style>
