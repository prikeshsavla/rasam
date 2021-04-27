<template>
  <div>
    <div id="stories" class="storiesWrapper"></div>
  </div>
</template>

<script>
import Zuck from 'zuck.js'
import 'zuck.js/dist/zuck.min.css'
import 'zuck.js/dist/skins/facesnap.min.css'
import format from '@/plugins/registerTimeago'

export default {
  props: {
    stories: {
      type: Array,
      required: true,
    },
  },
  watch: {
    stories() {
      this.buildStoriesViewer()
    },
  },
  mounted() {
    this.buildStoriesViewer()
  },
  methods: {
    buildStoriesViewer() {
      const object = this.stories.map((story) => {
        return { ...story }
      })

      const language = {
        // if you need to translate :)
        unmute: 'Touch to unmute',
        keyboardTip: 'Press space to see next',
        visitLink: 'Visit link',
        time: {
          ago: 'ago',
          hour: 'hour',
          hours: 'hours',
          minute: 'minute',
          minutes: 'minutes',
          fromnow: 'from now',
          seconds: 'seconds',
          yesterday: 'yesterday',
          tomorrow: 'tomorrow',
          days: 'days',
        },
      }
      Zuck('stories', {
        backNative: true,
        previousTap: true,
        skin: 'facesnap',
        autoFullScreen: false,
        avatars: true,
        paginationArrows: false,
        list: false,
        cubeEffect: true,
        localStorage: true,
        stories: object,
        language,
        template: {
          viewerItemBody(index, currentIndex, item) {
            const article = JSON.parse(JSON.stringify(item))
            // console.log(article)
            return `<div  class="item ${
              get(item, 'seen') === true ? 'seen' : ''
            } ${currentIndex === index ? 'active' : ''}"
                    data-time="${get(item, 'time')}" data-type="${get(
              item,
              'type'
            )}" data-index="${index}" data-item-id="${get(item, 'id')}">

                  <div class="card">
                    <div class="card-content">
                      <strong class="has-text-primary is-clipped double-line-only">
                        ${article.linkText}
                      </strong>
                        <div class="is-clipped line-clamp">
                        ${article.contentsnippet}
                        </div>  
                        <small>
                          <span class="is-6 has-text-weight-medium has-text-grey">
                          ${article.author}
                          </span>
                         
                          ~<time class="has-text-grey" >${format(
                            article.time * 1000,
                            'slim'
                          )}</time>
                        </small> 
                      </div>
                    </div>
                    ${
                      get(item, 'link')
                        ? `<a class="tip link" href="${get(item, 'link')}" >
                            ${language.visitLink}
                          </a>`
                        : ''
                    }
                </div>`
          },
        },
      })
    },
  },
}

const get = function (array, what) {
  if (array) {
    return array[what] || ''
  } else {
    return ''
  }
}
</script>

<style>
.stories.carousel .story > .item-link > .info .name {
  font-size: 0.8em;
}
#zuck-modal-content .story-viewer .head .left .info {
  max-width: 70vw;
}
#zuck-modal-content .story-viewer.with-back-button .head .left .item-preview {
  margin-left: 0;
}

#zuck-modal-content .story-viewer.with-back-button .head .left > .back {
  display: none;
}
#zuck-modal-content .story-viewer .head .left .info .time {
  display: none;
}
#zuck-modal-content .story-viewer .head .left .info .name {
  font-size: 0.8em;
}
.storiesWrapper {
  padding: 0;
  margin: 0 auto;
}

#zuck-modal-content .story-viewer .slides .item {
  background: #fff;
}

#zuck-modal-content .story-viewer .slides .item .card {
  position: absolute;
  bottom: 60px;
  box-shadow: none !important;
  border-radius: 0px;
}

#zuck-modal-content .story-viewer .slides .item .tip.link {
  background: none;
  color: #000;
}
/* #zuck-modal-content .story-viewer .head {
  background: rgba(0,0,0,0.2);
}
#zuck-modal-content .story-viewer .head .left .info .name {
    color: #fff;
} */

#zuck-modal-content .story-viewer .slides-pointers > * > * {
  display: table-cell;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}
#zuck-modal-content .story-viewer .slides-pointers > * > .seen {
  background: #000;
}
#zuck-modal-content .story-viewer .slides-pointers > * > * > b {
  background: #000;
  width: auto;
  max-width: 0;
  height: 2px;
  display: block;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-play-state: paused;
  animation-play-state: paused;
  border-radius: 2px;
}

#zuck-modal-content .story-viewer .head {
  text-shadow: none;
}
</style>
