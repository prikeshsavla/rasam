<template>
  <div class="column is-flex is-4">
    <div
      class="card is-flex is-rounded is-flex-direction-column is-justify-content-space-between"
    >
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48">
              <img
                :src="`https://ui-avatars.com/api/?name=${
                  article.creator || article.author
                }&background=00d1b2`"
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div class="media-content">
            <p>
              <!-- <small>
                <span class="is-6 has-text-weight-medium">{{
                  article.feed.title
                }}</span>
              </small> -->
            </p>
            <a :href="article.link" target="_blank" class="has-text-primary"
              ><strong>{{ article.title }}</strong></a
            >

            <div
              class="content is-clipped line-clamp"
              v-html="article.contentSnippet"
            ></div>
            <p>
              <small>
                <span class="is-6 has-text-weight-medium has-text-grey">{{
                  article.creator || article.author
                }}</span>
                ~<time-ago
                  class="has-text-grey"
                  :date="article.isoDate"
                ></time-ago>
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TimeAgo from "./TimeAgo.vue";
export default {
  components: { TimeAgo },
  props: ["article"],
  methods: {
    formatDate(dateString) {
      const dateObj = new Date(dateString);
      return dateObj.toLocaleDateString();
    },
  },
};
</script>

<style>
html {
  --lh: 1.4rem;
  line-height: var(--lh);
}

.content.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

/* 
https://daily-dev-tips.com/posts/css-truncate-text-with-ellipsis/
 */
.card.is-rounded {
  border-radius: 0.5em;
}
</style>