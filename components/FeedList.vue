<template>
  <div>
    <v-row>
      <template v-if="feeds.length === 0">
        <v-col v-for="n in 21" :key="n" class="pa-0" cols="12" sm="4">
          <v-sheet outlined class="pa-3">
            <v-skeleton-loader type="list-item-three-line"></v-skeleton-loader>
          </v-sheet>
        </v-col>
      </template>
      <v-col
        v-for="feed in feeds"
        :key="feed.link"
        class="pa-0"
        cols="12"
        sm="4"
      >
        <feed-card :feed="feed" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    feeds: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll, { passive: true })
  },
  methods: {
    onScroll() {
      const body = document.body
      const html = document.documentElement
      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      )

      const position = window.outerHeight + document.documentElement.scrollTop

      if (height - position < window.outerHeight + 300) {
        this.$emit('nextPage')
      }
    },
  },
}
</script>
