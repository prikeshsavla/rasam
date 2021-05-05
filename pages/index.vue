<template>
  <component
    :is="currentComponent"
    @completedOnboarding="completedOnboarding"
  ></component>
</template>

<script>
export default {
  data() {
    return {
      currentComponent: '',
      value: 'recent',
    }
  },
  async fetch() {
    const onboarded = await this.$store.dispatch('settings/get', 'onboarded')
    if (onboarded) {
      this.currentComponent = 'home-screen'
    } else {
      this.currentComponent = 'onboarding'
    }
  },
  methods: {
    async completedOnboarding() {
      await this.$store.dispatch('settings/set', {
        name: 'onboarded',
        value: true,
      })
      this.currentComponent = 'home-screen'
    },
  },
}
</script>

<style></style>
