<template>
  <v-card
    class="accent py-2"
    outlined
    rounded
    nuxt
    :to="`/stacks/${encrypt(feed.link)}`"
  >
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="mb-1">
          <v-icon size="20">mdi-book</v-icon>
          <strong>{{ feed.title }}</strong>
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
