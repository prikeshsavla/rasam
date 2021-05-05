<template>
  <v-text-field
    v-model="searchQuery"
    :loading="isLoading"
    solo
    clearable
    @click:prepend-inner="search"
  >
    <template v-slot:label>
      <v-icon style="vertical-align: middle"> mdi-magnify </v-icon> Search
    </template>

    <v-icon slot="prepend-inner-icon" color="primary"> mdi-plus </v-icon>
  </v-text-field>
  <!-- https://www.smashingmagazine.com/feed/ -->
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      isLoading: false,
    }
  },
  methods: {
    search() {
      this.isLoading = true
      console.log('searching')
      this.isLoading = false
    },
  },
}
</script>

<style></style>
