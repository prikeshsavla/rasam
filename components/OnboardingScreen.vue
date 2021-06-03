<template>
  <v-card class="mx-auto fill-height" flat>
    <v-window v-model="step" :touchless="true" class="fill-height">
      <v-window-item :value="1">
        <v-carousel
          v-model="model"
          cycle
          show-arrows-on-hover
          :continuous="true"
          :show-arrows="false"
          hide-delimiters
          delimiter-icon="mdi-minus"
          height="400"
        >
          <v-carousel-item v-for="n in 3" :key="n">
            <v-sheet color="primary" height="100%" tile>
              <v-img :src="'https://picsum.photos/1920?random=' + n"></v-img>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
        <div class="fill-height">
          <v-card-title class="title text-center justify-center">
            First to Know
          </v-card-title>
          <v-card-subtitle class="text-center mx-auto" style="max-width: 300px">
            All your substacks in one place, be the first to know the last post.
          </v-card-subtitle>
          <v-card-actions class="d-flex flex-column">
            <v-btn
              :disabled="step === 3"
              color="primary"
              x-large
              depressed
              @click="step++"
            >
              Next
            </v-btn>
          </v-card-actions>
        </div>
      </v-window-item>

      <v-window-item :value="2">
        <v-card-title class="title text-center justify-center">
          Need help with your first?
        </v-card-title>
        <v-card-subtitle class="text-center mx-auto" style="max-width: 300px">
          Select a few curated substacks to help you get in the groove or skip
          forward and add your favorites.
        </v-card-subtitle>

        <v-list three-line height="400" style="overflow-y: scroll">
          <v-list-item-group
            v-model="selected"
            active-class="primary--text lighten-1"
            multiple
          >
            <template v-for="(item, index) in items">
              <v-list-item :key="item.title">
                <template #default="{ active }">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>

                    <v-list-item-subtitle
                      v-text="item.contentSnippet"
                    ></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-icon v-if="!active" color="grey lighten-1">
                      mdi-book
                    </v-icon>

                    <v-icon v-else color="primary "> mdi-book </v-icon>
                  </v-list-item-action>
                </template>
              </v-list-item>

              <v-divider
                v-if="index < items.length - 1"
                :key="index"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
        <v-divider></v-divider>
        <v-card-actions class="d-flex flex-column">
          <v-btn
            :disabled="step === 3 || selected.length === 0"
            color="primary"
            x-large
            depressed
            @click="saveSuggested"
          >
            Next
          </v-btn>
        </v-card-actions>
      </v-window-item>

      <v-window-item
        :value="3"
        class="fill-height d-flex justify-center flex-column"
      >
        <div class="pa-4 text-center">
          <h3 class="title mb-2">Welcome to Rasam</h3>
          <div v-if="!completedMessage" class="caption mb-5 grey--text">
            Syncing the Substacks
          </div>

          <div class="mb-5 primary--text" v-html="completedMessage"></div>
          <v-progress-circular
            indeterminate
            color="primary"
            size="50"
          ></v-progress-circular>
        </div>
      </v-window-item>
    </v-window>
  </v-card>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data: () => ({
    step: 1,
    model: 0,
    selected: [0],
    completedMessage: null,
  }),
  computed: {
    ...mapState({
      items: ({ feeds }) => feeds.suggested,
    }),
  },

  methods: {
    async saveSuggested() {
      this.step++
      if (this.selected.length > 0) {
        const addFeedResponse = await this.addFromSuggested(this.selected)
        const feedNames = addFeedResponse.map((response) => response.feedTitle)
        const totalItems = addFeedResponse
          .map((response) => response.noOfItems)
          .reduce((a, b) => a + b)
        this.completedMessage = `Added total <strong>${totalItems}</strong> articles from <strong> ${feedNames.join(
          ', '
        )} </strong>`

        this.completedMessage += `<br><br> Showing Feed now...`

        setTimeout(() => {
          // this.step = 2
          this.completedMessage = null
          this.$emit('completedOnboarding')
        }, 3000)
      }
    },
    ...mapActions({
      addFromSuggested: 'feeds/addFromSuggested',
    }),
  },
}
</script>

<style></style>
