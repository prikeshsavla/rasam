<template>
  <v-btn icon @click="like">
    <template v-if="!!likedAt">
      <v-icon :color="color"> mdi-heart </v-icon>
      <span class="sr-only">Unlike</span>
    </template>
    <template v-else>
      <v-icon :color="color"> mdi-heart-outline </v-icon>
      <span class="sr-only">Like</span>
    </template>
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
    color: {
      type: String,
      default: 'primary',
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
      await this.$store.dispatch('items/likeItem', {
        guid: this.guid,
        liked: !this.liked,
      })
    },
  },
}
</script>

<style></style>
