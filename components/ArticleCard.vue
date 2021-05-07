<template>
  <v-card class="py-2 secondary" outlined shaped>
    <v-list-item three-line>
      <v-list-item-content>
        <small class="mb-1 single-line-only">{{ article.feedTitle }}</small>
        <v-list-item-title class="mt-2 mb-1">
          <nuxt-link
            :to="`/articles/${encrypt(article.guid)}`"
            class="is-clipped text-decoration-none double-line-only black--text"
          >
            <strong>{{ article.title }}</strong>
          </nuxt-link>
        </v-list-item-title>

        <v-list-item-subtitle class="mb-2">
          {{ article.contentSnippet }}
        </v-list-item-subtitle>

        <small>
          <span class="grey--text">{{ author }}</span>
          ~<time-ago class="grey--text" :date="article.isoDate"></time-ago>
        </small>
      </v-list-item-content>

      <v-list-item-action class="align-center">
        <v-list-item-action-text
          >~<time-ago class="grey--text" :date="article.isoDate"></time-ago
        ></v-list-item-action-text>
        <like-button
          :guid="article.guid"
          :liked-at="article.likedAt"
        ></like-button>
      </v-list-item-action>
    </v-list-item>
  </v-card>
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
    formatDate(dateString) {
      const dateObj = new Date(dateString)
      return dateObj.toLocaleDateString()
    },
    encrypt,
  },
}
</script>

<style></style>
