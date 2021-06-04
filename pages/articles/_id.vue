<template>
  <div class="primary">
    <v-app-bar app dense flat class="primary" fixed>
      <v-app-bar-nav-icon class="white--text" @click="back">
        <v-icon>mdi-arrow-left</v-icon>
      </v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <like-button color="white" :guid="article.guid" :liked-at="likedAt" />
      <v-btn icon class="white--text" @click="shareArticle">
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
      <v-btn v-if="article.link" :href="article.link" icon>
        <v-icon color="white">mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <v-sheet class="transparent pb-5 pt-10 px-5 d-flex justify-end flex-column">
      <div class="white--text">
        <p>
          <nuxt-link
            class="white--text text-decoration-none"
            :to="`/stacks/${encrypt(article.feedLink)}`"
          >
            {{ article.feedTitle }}
          </nuxt-link>
        </p>
        <h1 class="headline mb-3">
          {{ article.title }}
        </h1>

        <small class="d-flex justify-space-between">
          {{ author }}

          <span>
            ~<time-ago class="has-text-grey" :date="article.isoDate"></time-ago>
          </span>
        </small>
      </div>
    </v-sheet>
    <v-sheet class="px-5 py-3 rounded-t-xl" min-height="90vh" elevation="24">
      <div v-html-safe="content" class="content mt-4"></div>
    </v-sheet>

    <v-bottom-navigation :value="bottom" app grow fixed color="primary">
      <v-btn
        icon
        nuxt
        :to="`/stacks/${encrypt(article.feedLink)}`"
        color="grey"
      >
        <v-icon>mdi-book</v-icon>
      </v-btn>
      <like-button :guid="article.guid" :liked-at="likedAt" />
      <v-btn icon @click="shareArticle">
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
      <v-btn v-if="article.link" :href="article.link" icon>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Vue from 'vue'
import share from '@/plugins/share'
import VueSecureHTML from 'vue-html-secure'
import { encrypt } from '~/plugins/crypt'
import LikeButton from '~/components/LikeButton.vue'

Vue.use(VueSecureHTML)

export default {
  components: { LikeButton },
  layout: 'full',
  async asyncData({ store, params: { id } }) {
    await store.dispatch('items/getItemByID', id)
  },
  data() {
    return {
      bottom: 1,
    }
  },
  computed: {
    likedAt() {
      if (this.article.likedAt) {
        return this.article.likedAt
      } else {
        return null
      }
    },
    feedLink() {
      const url = new URL(this.article.feedLink)
      return url.href
        .replace('www.', '')
        .replace(/http(s):\/\//, '')
        .replace(/\/$/, '')
    },
    content() {
      return this.article['content:encoded'] || this.article.content
    },
    author() {
      return (
        this.article.author || this.article.creator || this.article.feedTitle
      )
    },
    ...mapState({
      article: ({ items }) => items.item,
    }),
  },
  methods: {
    encrypt,
    back() {
      // this.$router.back()
      if (window.history.length > 1) {
        window.history.back()
      } else {
        this.$router.push('/')
      }
    },
    shareArticle() {
      share({
        title: this.article.title,
        text: this.article.link,
        url: this.article.link,
      })
    },
  },
}
</script>

<style>
.content {
  overflow-wrap: anywhere;
}
.content * {
  max-width: 100% !important;
  white-space: pre-wrap;
}
.content h1,
.content h2,
.content h3,
.content h4,
.content h5 {
  margin-top: 1em;
}

figure {
  margin-bottom: 1em;
}
img {
  max-width: 100% !important;
  display: block !important;
  margin-bottom: 0.5em;
}
.v-application a.primary {
  background-color: #fff !important;
}
</style>
