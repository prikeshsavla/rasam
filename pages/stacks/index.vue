<template>
  <v-container>
    <v-list-item>
      <template>
        <v-list-item-content>
          <v-list-item-title><h1 class="mt-3">Stacks</h1></v-list-item-title>
          <v-list-item-subtitle>
            Substacks that are in your feed.
          </v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </v-list-item>

    <keep-alive>
      <search-input @search="search" />
    </keep-alive>
    <v-fade-transition>
      <div v-if="searchResults.length > 0" class="mt-2">
        <small>{{ searchResults.length }} Results found.</small>

        <article-list
          class="mt-3 mb-5"
          :items="searchResults"
          :show-loader="false"
        />
      </div>

      <feed-list v-else :feeds="feeds" class="mt-6 mb-5" />
    </v-fade-transition>
    <v-speed-dial
      v-model="fab"
      :top="top"
      :bottom="bottom"
      :right="right"
      :left="left"
      :direction="direction"
      :open-on-hover="hover"
      :transition="transition"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="primary" dark fab>
          <v-icon v-if="fab"> mdi-close </v-icon>
          <v-icon v-else> mdi-book-multiple </v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="primary" @click="sheet = !sheet">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn fab dark small color="black" @click="saveDBFile">
        <v-icon> mdi-download-box </v-icon>
      </v-btn>
    </v-speed-dial>
    <v-bottom-sheet v-model="sheet" inset>
      <v-sheet class="text-right">
        <v-btn class="mt-3" text color="grey" @click="sheet = !sheet">
          <v-icon>mdi-close</v-icon>
          close
        </v-btn>
        <div class="px-3">
          <add-feed></add-feed>
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { pack } from 'jsonpack'
export default {
  data() {
    return {
      sheet: false,
      direction: 'top',
      fab: false,
      fling: false,
      hover: false,
      tabs: null,
      top: false,
      right: true,
      bottom: true,
      left: false,
      transition: 'slide-y-reverse-transition',
    }
  },
  computed: {
    ...mapState({
      feeds: ({ feeds }) => feeds.list,
    }),
    ...mapGetters({
      searchResults: 'stackItems/searchResults',
    }),
  },
  async mounted() {
    const feeds = await this.$store.dispatch('feeds/fetchFeedsOnly')
    await this.$store.dispatch('stackItems/fetchAll', {})
    if (!feeds.length) {
      this.$router.push('/onboarding')
    }
  },
  methods: {
    search(input) {
      this.$store.commit('stackItems/setQuery', input)
    },
    async saveDBFile() {
      const filename = 'export.rasam'
      const jsonToWrite = await this.$store.dispatch('settings/exportData')

      const packed = pack(jsonToWrite)
      const blob = new Blob([packed], { type: 'text/json' })
      const link = document.createElement('a')
      link.download = filename
      link.href = window.URL.createObjectURL(blob)
      link.dataset.downloadurl = ['text/json', link.download, link.href].join(
        ':'
      )

      const evt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      })

      link.dispatchEvent(evt)
      link.remove()
    },
  },
}
</script>

<style scoped>
.v-speed-dial {
  position: absolute;
}
.v-btn--floating {
  position: relative;
}
</style>
