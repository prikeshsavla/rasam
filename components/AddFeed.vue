<template>
  <v-text-field v-model="feedURL" :loading="loading" label="Add Blog/ RSS Feed">
    <v-btn slot="append" color="primary" :loading="loading" @click="addFeed">
      <v-icon color="white"> mdi-plus </v-icon>
    </v-btn>
  </v-text-field>
</template>

<script>
export default {
  data() {
    return {
      feedURL: '',
      loading: false,
      buttonText: '+',
    }
  },
  methods: {
    async addFeed() {
      this.loading = true
      const result = await this.$store.dispatch('feeds/addFeed', {
        url: this.feedURL,
      })
      if (result) {
        this.feedURL = ''
        alert(`${result.noOfItems} articles of ${result.feedTitle} added`)
      } else {
        alert(`Cannot find feed for ${this.feedURL}`)
      }
      this.loading = false
    },
  },
}
</script>

<style></style>
