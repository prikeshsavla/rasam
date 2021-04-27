<template>
  <button
    type="button"
    class="button is-small"
    :class="buttonClass"
    @click="like"
  >
    ♥
  </button>
</template>

<script>
export default {
  props: {
    link: {
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
    like() {
      this.$store.dispatch('feeds/items/likeItem', {
        link: this.link,
        liked: !this.liked,
      })
    },
  },
}
</script>

<style></style>
