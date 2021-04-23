<template>
  <section class="section px-3 pt-3">
    <button
      @click="back"
      class="button is-fullwidth is-primary is-outlined mt-3"
    >
      Back
    </button>
    <div class="container">
      <small>
        {{ article.feedTitle }}
      </small>
      <h1 class="title mb-3 mt-5 is-4">
        <a :href="article.link"> {{ article.title }}</a>
      </h1>
      <small>
        {{ author }} ~<time-ago
          class="has-text-grey"
          :date="article.isoDate"
        ></time-ago
      ></small>
      <hr class="my-3" />
      <div class="content" v-html="article['content:encoded']"></div>
    </div>
  </section>
</template>

<script>
import { decrypt } from "@/plugins/crypt";

export default {
  async asyncData({ store, params: { id } }) {
    const item = await store.dispatch("item/getItem", decrypt(id));
    return { article: item };
  },
  methods: {
    back() {
      this.$router.back();
      window.history.back();
    },
  },
  computed: {
    feedLink() {
      const url = new URL(this.article.feedLink);
      return url.href
        .replace("www.", "")
        .replace(/http(s):\/\//, "")
        .replace(/\/$/, "");
    },
    author() {
      return (
        this.article.author || this.article.creator || this.article.feedTitle
      );
    },
  },
};
</script>

<style>
.content {
  overflow-wrap: anywhere;
  font-size: 0.9em;
}
a {
  color: hsl(171, 100%, 41%);
}
figure {
  margin: 0 !important;
}
.content blockquote {
  padding: 1em;
}
img {
  max-width: 100% !important;
  display: block;
}
</style>