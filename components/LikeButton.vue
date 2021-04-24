<template>
  <button type="button" @click="like" class="button is-small " :class="buttonClass">♥</button>
</template>

<script>
export default {
  props: ["link", "likedAt"],
  computed: {
      buttonClass(){
          return this.liked ? 'is-primary':  ' is-light'
      },
      liked(){
          return !!this.likedAt
      }
  },
  methods: {
    like() {
      this.$store.dispatch("feeds/items/likeItem", {link: this.link, liked: !this.liked});
    },
  },
};
</script>

<style>
</style>