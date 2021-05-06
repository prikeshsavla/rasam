<template>
  <v-text-field
    hide-details
    solo
    clearable
    @click:clear="search('')"
    @input="search"
  >
    <template #label>
      <v-icon style="vertical-align: middle"> mdi-magnify </v-icon> Search for
      articles
    </template>
  </v-text-field>
  <!-- https://www.smashingmagazine.com/feed/ -->
</template>

<script>
export default {
  props: {
    delay: {
      type: Number,
      default: 500,
    },
  },
  data() {
    return {
      debounced: null,
    }
  },
  methods: {
    search(input) {
      if (this.debounced) {
        clearTimeout(this.debounced)
      }
      this.debounced = setTimeout(() => {
        this.$emit('search', input || '')
        console.log('hello')
      }, this.delay)
    },
  },
}
</script>

<style></style>
