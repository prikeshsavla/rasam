<template>
  <div class="story secondary">
    <div class="timeline">
      <div v-for="(slide, i) in slides" :key="i" class="slice">
        <div class="progress">&nbsp;</div>
      </div>
    </div>
    <div class="slide">
      <story-card :article="slides[currentSlideIndex]" />
    </div>
    <div class="text-center pa-5">
      <v-icon>mdi-arrow-up</v-icon> <v-icon>mdi-arrow-up</v-icon>
      <v-icon>mdi-arrow-up</v-icon>
    </div>
    <v-fade-transition> </v-fade-transition>
  </div>
</template>

<script>
import anime from 'animejs/lib/anime.es.js'
import Hammer from 'hammerjs'
import { encrypt } from '~/plugins/crypt'

const SLIDE_DURATION = 6000

export default {
  props: {
    story: {
      type: Object,
      required: true,
    },
    slides: {
      type: Array,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  data() {
    const timeline = anime.timeline({
      autoplay: false,
      duration: SLIDE_DURATION,
      easing: 'linear',
    })

    return {
      currentSlideIndex: 0,
      isActive: false,
      timeline,
    }
  },
  computed: {
    action() {
      return this.story.action
    },
  },
  watch: {
    action(newValue) {
      switch (newValue) {
        case 'activate':
          this.activate()
          // this.timeline.pause();
          break
        case 'deactivate':
          this.deactivate()
          break
        default:
          break
      }
    },
  },
  mounted() {
    const $timeline = this.$el.getElementsByClassName('timeline')[0]

    // Add progress bars to the timeline animation group
    this.slides.forEach((slide, index) => {
      this.timeline.add({
        targets: $timeline
          .getElementsByClassName('slice')
          [index].getElementsByClassName('progress'),
        width: '100%',
        changeBegin: () => {
          // Update the Vue componenet state when progress bar begins to play
          this.currentSlideIndex = index
        },
        complete: () => {
          // Move to the next story when finished playing all slides
          if (index === this.slides.length - 1) {
            this.nextStory()
          }
        },
      })
    })

    this.hammer = new Hammer.Manager(this.$el, {
      recognizers: [
        [Hammer.Swipe, { direction: Hammer.DIRECTION_ALL }],
        [Hammer.Tap],
        [Hammer.Press, { time: 1, threshold: 1000000 }],
      ],
    })

    this.hammer.on('press', () => {
      this.timeline.pause()
      // console.log('press: press')
    })

    this.hammer.on('pressup tap', () => {
      this.timeline.play()
      // console.log('press: pressup tap')
    })

    // Tap on the side to navigate between slides
    this.hammer.on('tap', (event) => {
      // console.log('tap: tap')
      // console.log('center.x', event.center.x)
      // console.log('window.outerWidth', window.outerWidth)
      // console.log('next?', event.center.x > window.outerWidth / 3)
      if (event.center.x > window.outerWidth / 3) {
        this.nextSlide()
      } else {
        this.previousSlide()
      }
    })

    // // Handle swipe
    // this.hammer.on("pan", (event) => {
    /// /   console.log("pan: pan");
    //   if (event.isFinal) {
    //     if (event.deltaX < 0) {
    //       this.nextStory();
    //     } else if (event.deltaX > 0) {
    //       this.previousStory();
    //     }
    //   }
    // });

    this.hammer.on('swipeup', (event) => {
      // console.log('SWIPE: swipeup')

      this.$router.push(
        `/articles/${encrypt(this.slides[this.currentSlideIndex].guid)}`
      )
    })

    this.hammer.on('swipedown', (event) => {
      // console.log('SWIPE: swipedown')
      this.$router.push('/')
    })

    this.hammer.on('swiperight', (event) => {
      // console.log('SWIPE: swiperight')

      this.previousStory()
    })

    this.hammer.on('swipeleft', (event) => {
      // console.log('SWIPE: swipeleft')

      this.nextStory()
    })

    if (this.index === 0) {
      this.activate()
    }
  },
  methods: {
    activate() {
      // Start timer
      this.resetSlide()
    },
    deactivate() {
      this.timeline.pause()
    },
    resetSlide() {
      // Jump to beginning of the slide
      this.timeline.pause()
      this.timeline.seek(this.currentSlideIndex * SLIDE_DURATION)
      this.timeline.play()
    },
    nextSlide() {
      if (this.currentSlideIndex < this.slides.length - 1) {
        this.currentSlideIndex++
        this.resetSlide()
      } else {
        this.nextStory()
      }
    },
    previousSlide() {
      if (this.currentSlideIndex > 0) {
        this.currentSlideIndex--
        this.resetSlide()
      } else {
        this.previousStory()
      }
    },
    nextStory() {
      // EventBus.$emit("NEXT_STORY");
      this.$store.dispatch('stories/nextStory')
    },
    previousStory() {
      // EventBus.$emit("PREVIOUS_STORY");
      this.$store.dispatch('stories/previousStory')
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.story {
  /* float: left; */
  position: relative;
  height: 100vh;
  width: 100vw;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.timeline {
  display: flex;
  flex-grow: 0;
  width: 100%;
}

.timeline > .slice {
  background: rgba(0, 0, 0, 0.25);
  height: 5px;
  margin: 3px 2px;
  width: 100%;
}

.timeline > .slice > .progress {
  background: black;
  height: 4px;
  width: 0%;
}

.slide {
  /* Take the rest of the page */
  flex-grow: 1;

  /* Center align */
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
</style>
