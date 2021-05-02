<template>
  <v-container>
    <v-app-bar app dense elevate-on-scroll>
      <v-app-bar-title> Rasam </v-app-bar-title>
    </v-app-bar>
    <div class="block mb-4">
      <!-- <search-input></search-input> -->
      <story-timeline :stories="stories"></story-timeline>
    </div>

    <v-row>
      <v-col
        v-for="item in items"
        :key="item.link"
        class="pa-0"
        cols="12"
        sm="4"
      >
        <card :article="item" />
      </v-col>
    </v-row>
    <v-bottom-sheet v-model="sheet" inset>
      <template #activator="{ on, attrs }">
        <v-fab-transition>
          <v-btn
            color="primary"
            dark
            fixed
            bottom
            fab
            right
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <v-sheet class="text-right">
        <v-btn class="mt-3" text color="grey" @click="sheet = !sheet">
          <v-icon>mdi-close</v-icon>
          close
        </v-btn>
        <div class="px-3">
          <feed-input></feed-input>
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      sheet: false,
    }
  },
  async fetch() {
    await this.$store.dispatch('stories/fetchAll')
    await this.$store.dispatch('feeds/fetchAll')
  },

  computed: {
    ...mapGetters({
      items: 'feeds/items/paginatedList',
      pages: 'feeds/items/pages',
    }),
    ...mapState({
      stories: ({ stories }) => stories.list,
    }),
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
        this.nextPage()
      }
    },
    ...mapActions({
      nextPage: 'feeds/items/nextPage',
    }),
  },
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
}
</style>
