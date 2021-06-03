<template>
  <div>
    <v-fade-transition>
      <v-row>
        <template v-if="items.length === 0 && showLoader">
          <v-col v-for="n in 21" :key="n" class="pb-0" cols="12" sm="4">
            <v-sheet outlined shaped class="pa-3 py-5">
              <v-skeleton-loader
                type="list-item-three-line"
              ></v-skeleton-loader>
            </v-sheet>
          </v-col>
        </template>

        <v-col
          v-for="item in items"
          :key="item.guid"
          class="pb-0"
          cols="12"
          sm="4"
        >
          <article-card :article="item" />
        </v-col>
      </v-row>
    </v-fade-transition>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    showLoader: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      debounced: null,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll, { passive: true })
  },
  methods: {
    onScroll() {
      if (this.debounced) {
        clearTimeout(this.debounced)
      }

      this.debounced = setTimeout(() => {
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
      }, 100)
    },
  },
}
</script>
