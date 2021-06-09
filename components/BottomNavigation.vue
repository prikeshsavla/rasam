<template>
  <v-bottom-navigation v-model="value" app grow fixed color="primary">
    <v-btn icon value="index" nuxt to="/" max-width="none">
      <v-icon>mdi-home-variant-outline</v-icon>
    </v-btn>

    <v-btn icon value="stacks" nuxt to="/stacks" max-width="none">
      <v-icon>mdi-book-multiple</v-icon>
    </v-btn>

    <v-btn icon value="favorites" nuxt to="/favorites" max-width="none">
      <v-icon>mdi-heart-multiple</v-icon>
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
