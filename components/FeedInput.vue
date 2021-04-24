<template>
  <div class="field has-addons">
    <div class="control">
      <input
        class="input"
        v-model="feedURL"
        type="url"
        placeholder="Add a Blog/Feed"
      />
    </div>
    <div class="control">
      <a
        class="button is-info"
        :class="{ 'is-loading': isLoading }"
        @click="addFeed"
      >
        {{ buttonText }}
      </a>
    </div>
  </div>
  <!-- https://www.smashingmagazine.com/feed/ -->
</template>

<script>
export default {
  data() {
    return {
      feedURL: "",
      isLoading: false,
      buttonText: "Add",
    };
  },
  methods: {
    async addFeed() {
      this.isLoading = true;
      await this.$store.dispatch("feeds/addFeed", { url: this.feedURL });
      this.isLoading = false;
    },
  },
};
</script>

<style>
</style>