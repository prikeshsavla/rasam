<template>
  <v-card class="secondary py-2" outlined rounded>
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="mb-1">
          <nuxt-link
            :to="`/feeds/${encrypt(feed.link)}`"
            class="is-clipped text-decoration-none double-line-only black--text"
          >
            <strong>{{ feed.title }}</strong>
          </nuxt-link>
        </v-list-item-title>

        <v-list-item-subtitle class="mb-2" v-html="feed.description">
        </v-list-item-subtitle>
        <small>
          {{ feedLink }}
        </small>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import { encrypt } from '@/plugins/crypt'
export default {
  props: {
    feed: {
      type: Object,
      required: true,
    },
  },
  computed: {
    feedLink() {
      const url = new URL(this.feed.link)
      return url.href
        .replace('www.', '')
        .replace(/http(s):\/\//, '')
        .replace(/\/$/, '')
    },
  },
  methods: {
    encrypt,
  },
}
</script>

<style></style>
