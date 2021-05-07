<template>
  <v-btn icon @click="like">
    <v-icon v-if="!!likedAt" color="yellow darken-3"> mdi-star </v-icon>
    <v-icon v-else color="grey lighten-1"> mdi-star-outline </v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    guid: {
      type: String,
      required: true,
    },
    likedAt: {
      type: Date,
      default: null,
    },
  },
  computed: {
    buttonClass() {
      return this.liked ? 'is-primary' : ' is-light'
    },
    liked() {
      return !!this.likedAt
    },
  },
  methods: {
    async like() {
      await this.$store.dispatch('feeds/items/likeItem', {
        guid: this.guid,
        liked: !this.liked,
      })
    },
  },
}
</script>

<style></style>
