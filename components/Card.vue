<template>
  <div
    class="card"
    style="
      width: 100%;
      box-shadow: none !important;
      outline: 0.5px solid #ddd;
      border-radius: 0px;
    "
  >
    <div class="card-content">
      <p>
        <small>
          <span class="is-6 is-clipped single-line-only has-text-weight-medium">
            {{ article.feedTitle }}
          </span>
        </small>
       
      </p>
      <nuxt-link
        :to="`article/${encrypt(article.link)}`"
        class="has-text-primary is-clipped double-line-only"
      >
        <strong>{{ article.title }}</strong>
      </nuxt-link>

      <div class="is-clipped line-clamp">
        {{ article.contentSnippet }}
      </div>
       <small>
         <a :href="this.article.feedLink"  class="has-text-primary">{{ feedLink }}</a>
        </small><br>
      <small>
        <span class="is-6 has-text-weight-medium has-text-grey">{{
          author
        }}</span>
        ~<time-ago class="has-text-grey" :date="article.isoDate"></time-ago>
      </small>
    </div>
    <!-- <div class="card-image has-text-centered pt-5" v-if="article.enclosure" >
        <a :href="article.link"  class="has-text-primary"
              >
         <img
          class="block" 
            :src="article.enclosure.url"
            alt="Placeholder image" style="max-height: 200px; object-fit: contain;"
          />
        </a>
      </div> -->
  </div>
</template>

<script>
import {encrypt} from "@/plugins/crypt"
import TimeAgo from "./TimeAgo.vue";
export default {
  components: { TimeAgo },
  props: ["article"],
  methods: {
    formatDate(dateString) {
      const dateObj = new Date(dateString);
      return dateObj.toLocaleDateString();
    },
    encrypt
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
html {
  --lh: 1.4rem;
  line-height: var(--lh);
}

.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.single-line-only {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.double-line-only {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 
https://daily-dev-tips.com/posts/css-truncate-text-with-ellipsis/
 */
.card.is-rounded {
  border-radius: 0.5em;
}
</style>