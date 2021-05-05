<template>
  <onboarding-screen
    @completedOnboarding="completedOnboarding"
  ></onboarding-screen>
</template>

<script>
export default {
  layout: 'full',
  methods: {
    async completedOnboarding() {
      await this.$store.dispatch('settings/set', {
        name: 'onboarded',
        value: true,
      })
      this.$router.push('/')
    },
  },
}
</script>

<style></style>
