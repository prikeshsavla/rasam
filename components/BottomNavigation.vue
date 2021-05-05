<template>
  <v-bottom-navigation v-model="value" app grow fixed color="primary">
    <v-btn value="index" nuxt to="/">
      <!-- <span>Home</span> -->

      <v-icon>mdi-home-variant-outline</v-icon>
    </v-btn>

    <v-btn value="stacks" nuxt to="/stacks">
      <!-- <span>Stacks</span> -->

      <v-icon>mdi-view-grid-outline</v-icon>
    </v-btn>

    <v-btn value="bookmarks" nuxt to="/bookmarks">
      <!-- <span>Bookmarks</span> -->

      <v-icon>mdi-bookmark-outline</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  data() {
    return {
      value: '',
    }
  },

  created() {
    this.value = this.$route.name
  },
}
</script>

<style>
.v-bottom-navigation .v-btn:not(.v-btn--round).v-size--default {
  height: 56px;
}
</style>
