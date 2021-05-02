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
      if (await this.$store.dispatch('feeds/addFeed', { url: this.feedURL })) {
        this.feedURL = ''
      }
      this.isLoading = false
    },
  },
}
</script>

<style></style>
