<template>
  <v-container>
    <h1 class="mt-3">Stacks</h1>
    <p>Substacks that are in your feed.</p>

    <keep-alive>
      <search-input @search="search" />
    </keep-alive>
    <v-fade-transition>
      <div class="mt-2" v-if="searchResults.length > 0">
        <small>{{ searchResults.length }} Results found.</small>

        <article-list
          class="mt-3 mb-5"
          :items="searchResults"
          :show-loader="false"
        />
      </div>

      <feed-list v-else :feeds="feeds" class="mt-6 mb-5" />
    </v-fade-transition>
    <v-fab-transition>
      <v-btn
        color="primary"
        dark
        fixed
        bottom
        fab
        right
        style="bottom: 80px"
        @click="sheet = !sheet"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
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
export default {
  data() {
    return {
      sheet: false,
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
    await this.$store.dispatch('feeds/fetchFeedsOnly')
    await this.$store.dispatch('stackItems/fetchAll', {})
  },
  methods: {
    search(input) {
      console.log('search:' + input)
      this.$store.commit('stackItems/setQuery', { query: input })
    },
  },
}
</script>
