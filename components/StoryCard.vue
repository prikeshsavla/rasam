<template>
  <v-container>
    <small class="mb-1 single-line-only">{{ article.feedTitle }}</small>
    <div class="title mt-2 mb-1">
      <nuxt-link
        :to="`/articles/${encrypt(article.guid)}`"
        class="is-clipped text-decoration-none double-line-only black--text"
      >
        <strong>{{ article.title }}</strong>
      </nuxt-link>
    </div>

    <div class="mb-2 line-clamp">
      {{ article.contentSnippet }}
    </div>

    <small>
      <span class="grey--text">{{ author }}</span>
      ~<time-ago class="grey--text" :date="article.isoDate"></time-ago>
    </small>
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
