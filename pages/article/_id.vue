<template>
  <main>
    <navbar />

    <section class="section px-3 pt-3">
      <div class="container">
        <button
          class="button is-fullwidth is-primary is-outlined mt-3"
          @click="back"
        >
          Back
        </button>
        <small>
          {{ article.feedTitle }}
        </small>
        <h1 class="title mb-3 mt-5 is-4">
          <a :href="article.link"> {{ article.title }}</a>
        </h1>
        <small>{{ article.contentSnippet }}</small> <br />
        <small>
          {{ author }} ~<time-ago
            class="has-text-grey"
            :date="article.isoDate"
          ></time-ago
        ></small>
        <hr class="my-3" />
        <div class="content" v-html="content"></div>
      </div>
    </section>
  </main>
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
      // this.$router.back();
      window.history.back()
    },
  },
}
</script>

<style>
.content {
  overflow-wrap: anywhere;
  font-size: 0.9em;
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
}
img {
  max-width: 100% !important;
  display: block !important;
}
</style>
