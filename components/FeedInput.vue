<template>
  <div class="field has-addons">
    <div class="control">
      <input
        class="input"
        v-model="feedURL"
        type="url"
        placeholder="Find a repository"
      />
    </div>
    <div class="control">
      <a class="button is-info" @click="addFeed"> Add </a>
    </div>
  </div>
  <!-- https://www.smashingmagazine.com/feed/ -->
</template>

<script>
export default {
  data() {
    return {
      feedURL: "",
    };
  },
  methods: {
    addFeed() {
      console.log(`Adding ${this.feedURL} ...`);

      this.$store.dispatch("feeds/addFeed", { url: this.feedURL });

      console.log("Added.");
    },
  },
};
</script>

<style>
</style>