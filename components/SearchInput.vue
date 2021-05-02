<template>
  <v-text-field
    v-model="searchText"
    :loading="isLoading"
    placeholder="🔍 Search Articles / Blogs"
    outlined
    dense
    rounded
    label="Search"
    class="ma-0 pa-0"
  >
  </v-text-field>
  <!-- https://www.smashingmagazine.com/feed/ -->
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
      isLoading: false,
    }
  },
  methods: {
    addFeed() {
      this.isLoading = true
      // if (await this.$store.dispatch('feeds/addFeed', { url: this.feedURL })) {
      //   this.feedURL = ''
      // }
      this.isLoading = false
    },
  },
}
</script>

<style></style>
