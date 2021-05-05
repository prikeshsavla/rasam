<template>
  <v-container
    class="text-center d-flex align-center justify-center fill-height flex-column"
  >
    <p class="mb-5">
      {{ $route.query.title || $route.query.text }}
      <br />
      {{ $route.query.url }}
    </p>

    <div class="mb-5 primary--text" v-html="completedMessage"></div>
    <v-progress-circular
      indeterminate
      color="primary"
      size="50"
    ></v-progress-circular>
  </v-container>
</template>

<script>
export default {
  data() {
    return { completedMessage: null }
  },
  async mounted() {
    if (this.$route?.query?.url) {
      const response = await this.$store.dispatch('feeds/addFeed', {
        url: this.$route?.query?.url,
      })
      if (response) {
        this.completedMessage = `Added total <strong>${response.noOfItems}</strong> articles from <strong> ${response.feedTitle} </strong>`

        this.completedMessage += `<br><br> Showing Feed now...`

        setTimeout(() => {
          this.completedMessage = null
          this.$router.push('/')
        }, 3000)
      }
    }
  },
}
</script>

<style></style>
