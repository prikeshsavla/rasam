<template>
  <v-container
    class="
      text-center
      d-flex
      align-center
      justify-center
      fill-height
      flex-column
    "
  >
    <p class="mb-5">
      {{ $route.query.title || $route.query.text }}
      <br />
      {{ $route.query.url || $route.query.text }}
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
    if (this.$route?.query?.url || this.$route?.query?.text) {
      try {
        const url = new URL(this.$route?.query?.url || this.$route?.query?.text)
        const response = await this.$store.dispatch('feeds/addFeed', {
          url: url.toString(),
        })
        if (response) {
          this.completedMessage = `Added total <strong>${response.noOfItems}</strong> articles from <strong> ${response.feedTitle} </strong>`

          this.completedMessage += `<br><br> Showing Feed now...`

          setTimeout(() => {
            this.completedMessage = null
            this.$router.push('/')
          }, 3000)
        }
      } catch (error) {
        alert('Cannot find URL to add to feed. Going back home')
        this.$router.push('/')
      }
    } else {
      alert('Cannot find URL to add to feed. Going back home')
      this.$router.push('/')
    }
  },
}
</script>

<style></style>
