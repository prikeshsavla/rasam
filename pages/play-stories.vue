<template>
  <div>
    <div id="app" :style="getMargin()">
      <story
        v-for="(story, index) in stories"
        :key="index"
        ref="stories"
        :slides="story.items"
        :story="story"
        :index="index"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapState } from 'vuex'

export default {
  layout: 'full',
  computed: {
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
        this.$store.dispatch('stories/nextStory')
        // EventBus.$emit("NEXT_STORY");
      },
      200,
      { leading: true, trailing: false }
    )

    const debouncedPrevious = debounce(
      () => {
        this.$store.dispatch('stories/previousStory')
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
    getMargin() {
      if (window.innerWidth <= 768) {
        return { 'margin-left': this.currentStoryIndex * -100 + 'vw' }
      }

      return { 'margin-top': this.currentStoryIndex * -100 + 'vh' }
    },
  },
}
</script>

<style scoped>
html,
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
}
</style>
