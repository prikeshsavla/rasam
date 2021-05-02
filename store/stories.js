import db from '@/plugins/db'
import { decrypt, encrypt } from '~/plugins/crypt'
const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const STORY_INTERVAL = DAY * 7

export const state = () => ({
  list: [],
  currentStoryIndex: 0,
})

export const getters = {}

export const actions = {
  async fetchAll({ commit }) {
    const groupedFeeds = await getGroupedItems()

    const stories = groupedFeeds.map((story) => {
      return Object.assign(story, {
        action: '',
        photo:
          story.image && story.image.url
            ? story.image.url
            : `https://ui-avatars.com/api/?background=E37C43&color=fff&name=${story.title}`,
        id: encrypt(story.link),
      })
    })

    await commit('setStories', { stories })
    return stories
  },
  async setStoryIndexById({ state, commit }, id) {
    const storyIndex = state.list.map((item) => item.link).indexOf(decrypt(id))
    await commit('deactivateStory')
    await commit('setCurrentStoryIndex', storyIndex)
    await commit('activateStory')
  },
  async nextStory({ state, commit }) {
    if (state.currentStoryIndex < state.list.length - 1) {
      await commit('deactivateStory')
      await commit('setCurrentStoryIndex', state.currentStoryIndex + 1)
      await commit('activateStory')
    }
  },

  async previousStory({ state, commit }) {
    if (state.currentStoryIndex > 0) {
      await commit('deactivateStory')
      await commit('setCurrentStoryIndex', state.currentStoryIndex - 1)
      await commit('activateStory')
    } else {
      await commit('activateStory')
      this.$router.push('/')
    }
  },
}

export const mutations = {
  setStories(state, { stories }) {
    state.list = stories
  },
  setCurrentStoryIndex(state, currentStoryIndex) {
    state.currentStoryIndex = currentStoryIndex
  },
  activateStory(state) {
    state.list[state.currentStoryIndex].action = 'activate'
  },
  deactivateStory(state) {
    state.list[state.currentStoryIndex].action = 'deactivate'
  },
}

async function getGroupedItems(afterDate = new Date() - STORY_INTERVAL) {
  // Query
  const feeds = await db.feeds.toArray()

  // using parallel queries:
  await Promise.all(
    feeds.map(async (feed) => {
      feed.items = await db.items
        .where('feedLink')
        .equals(feed.link)
        .and(function (item) {
          return new Date(item.isoDate) > afterDate
        })
        .reverse()
        .sortBy('isoDate')
    })
  )

  return feeds
    .filter((feed) => feed.items.length > 0)
    .sort((nextFeed, previousFeed) => {
      return (
        new Date(previousFeed.items[0].isoDate) -
        new Date(nextFeed.items[0].isoDate)
      )
    })
}
