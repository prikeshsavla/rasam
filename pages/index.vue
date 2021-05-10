<template>
  <home-screen />
</template>

<script>
export default {
  async fetch() {
    const onboarded = await this.$store.dispatch('settings/get', 'onboarded')
    if (!onboarded) {
      this.$router.push('/onboarding')
    }
  },
}
</script>

<style></style>
