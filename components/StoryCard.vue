<template>
  <v-container>
    <v-card tile flat color="transparent">
      <p class="mb-1">{{ article.feedTitle }}</p>
      <h2 class="mt-2 mb-1">
        {{ article.title }}
      </h2>

      <div class="mb-2 line-clamp">
        {{ article.contentSnippet }}
      </div>

      <small class="justify-space-between d-flex">
        {{ author }}

        <span>~<time-ago :date="article.isoDate"></time-ago></span>
      </small>
    </v-card>
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
