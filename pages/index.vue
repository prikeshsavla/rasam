<template>
  <home-screen v-if="render" />
</template>

<script>
export default {
  data() {
    return {
      render: false,
    }
  },
  async fetch() {
    const onboarded = await this.$store.dispatch('settings/get', 'onboarded')
    if (!onboarded) {
      this.$router.push('/onboarding')
    } else {
      this.render = true
    }
  },
}
</script>

<style></style>
