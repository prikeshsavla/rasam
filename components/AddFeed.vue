<template>
  <v-text-field
    v-model="feedURL"
    :loading="isLoading"
    label="Add Blog/ RSS Feed"
  >
    <v-btn slot="append" color="primary" :loading="isLoading" @click="addFeed">
      <v-icon color="white"> mdi-plus </v-icon>
    </v-btn>
  </v-text-field>
  <!-- https://www.smashingmagazine.com/feed/ -->
</template>

<script>
export default {
  data() {
    return {
      feedURL: '',
      isLoading: false,
      buttonText: '+',
    }
  },
  methods: {
    async addFeed() {
      this.isLoading = true
      const result = await this.$store.dispatch('feeds/addFeed', {
        url: this.feedURL,
      })
      if (result) {
        this.feedURL = ''
        alert(`${result.noOfItems} articles of ${result.feedTitle} added`)
      } else {
        alert(`Cannot find feed for ${this.feedURL}`)
      }
      this.isLoading = false
    },
  },
}
</script>

<style></style>
