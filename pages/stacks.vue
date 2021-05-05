<template>
  <v-container>
    <v-app-bar app dense elevate-on-scroll>
      <v-app-bar-title> Stacks </v-app-bar-title>
    </v-app-bar>
    <!-- <search-input /> -->

    <feed-list :feeds="feeds" />

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
          <feed-input></feed-input>
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
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
  },
  mounted() {
    this.$store.dispatch('feeds/fetchFeedsOnly')
  },
}
</script>
