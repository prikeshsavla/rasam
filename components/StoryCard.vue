<template>
  <v-container>
    <small class="mb-1">{{ article.feedTitle }}</small>
    <h2 class="mt-1">
      <nuxt-link
        :to="`article/${encrypt(article.link)}`"
        class="text-decoration-none black--text"
      >
        <strong>{{ article.title }}</strong>
      </nuxt-link>
    </h2>

    <div>
      {{ article.contentSnippet }}
    </div>

    <small>
      <span class="grey--text">{{ author }}</span>
      ~<time-ago class="grey--text" :date="article.isoDate"></time-ago>
    </small>
    <div class="text-center mt-3">
      ^^^ <br />
      Open
    </div>
  </v-container>
</template>

<script>
import { encrypt } from '@/plugins/crypt'
import TimeAgo from './TimeAgo.vue'
export default {
  components: { TimeAgo },
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  computed: {
    feedLink() {
      const url = new URL(this.article.feedLink)
      return url.href
        .replace('www.', '')
        .replace(/http(s):\/\//, '')
        .replace(/\/$/, '')
    },
    author() {
      return (
        this.article.author || this.article.creator || this.article.feedTitle
      )
    },
  },
  methods: {
    encrypt,
  },
}
</script>

<style></style>
