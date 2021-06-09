<template>
  <div>
    <template v-if="stories.length">
      <v-card flat tile>
        <v-window v-model="currentStoryIndex" :touch="onTouch">
          <v-window-item
            v-for="(story, index) in stories"
            :key="`card-${index}`"
          >
            <story :slides="story.items" :story="story" :index="0" />
          </v-window-item>
        </v-window>
      </v-card>
    </template>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapState } from 'vuex'

export default {
  data() {
    return { onboarding: 0 }
  },
  computed: {
    onTouch() {
      return { left: this.nextStory, right: this.previousStory }
    },
    ...mapState({
      stories: ({ stories }) => stories.list,
      currentStoryIndex: ({ stories }) => stories.currentStoryIndex,
    }),
  },

  async mounted() {
    await this.$store.dispatch('stories/fetchAll')
    if (this.$route && this.$route.query && this.$route.query.id) {
      await this.$store.dispatch(
        'stories/setStoryIndexById',
        this.$route.query.id
      )
    }
    // Disable mouse wheel
    this.$el.addEventListener('wheel', (event) => {
      event.preventDefault()
    })

    // Debounced previous and next
    const debouncedNext = debounce(
      () => {
        this.nextStory()
        // EventBus.$emit("NEXT_STORY");
      },
      200,
      { leading: true, trailing: false }
    )

    const debouncedPrevious = debounce(
      () => {
        this.previousStory()

        // EventBus.$emit("PREVIOUS_STORY");
      },
      200,
      { leading: true, trailing: false }
    )

    // Mouse wheel handling
    // https://codepen.io/kayue/full/qGZOrb
    const debouncedWheelCallback = debounce(
      (event) => {
        // No wheel function in mobile
        if (window.innerWidth <= 768) {
          return
        }

        const delta = event.deltaY

        // Ignore small wheel movement
        if (Math.abs(delta) < 25) {
          debouncedWheelCallback.cancel()
          return
        }

        if (delta > 0) {
          debouncedNext()
        } else if (delta < 0) {
          debouncedPrevious()
        }
      },
      30,
      { leading: true, trailing: false }
    )

    this.$el.addEventListener('wheel', debouncedWheelCallback)
  },
  methods: {
    nextStory() {
      // console.log('NEXT_STORY')
      this.$store.dispatch('stories/nextStory')
    },
    previousStory() {
      // console.log('PREVIOUS_STORY')
      this.$store.dispatch('stories/previousStory')
    },
  },
}
</script>

<style scoped>
/* html,
body {
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif;
  background: #fafafa;
}

#app {
  transition: margin 0.3s ease-out;
}

@media (max-width: 768px) {
  html,
  body {
    height: 100vh;
  }

  #app {
    width: 9999vw;
    position: relative;
  }
} */
</style>
