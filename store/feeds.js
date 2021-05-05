import db from '@/plugins/db'
import Parser from 'rss-parser'
import getFeeds from 'get-feeds'
import { decrypt } from '~/plugins/crypt'
const CORS_PROXY =
  window.location.hostname === 'localhost'
    ? 'https://api.allorigins.win/raw?url='
    : 'https://api.allorigins.win/raw?url='

export const state = () => ({
  list: [],
  item: {},
  stories: [],
  suggested: [],
})

export const getters = {}

export const actions = {
  async addFeed({ dispatch }, { url }) {
    const parser = new Parser()
    const requestFeedUrl = url.replace(/\/$/, '')

    const { error, discoveredUrl } = await findFeedFromURL(requestFeedUrl, '')
    if (error) {
      console.error(error)
      return false
    }
    const feed = await parser.parseURL(CORS_PROXY + discoveredUrl)
    const items = feed.items.map((item) =>
      Object.assign(item, { feedTitle: feed.title, feedLink: feed.link })
    )
    const feedWithoutItems = Object.assign({}, feed, { items: [] })
    await db.feeds.put(feedWithoutItems)
    await db.items.bulkPut(items)

    await dispatch('commitAll')
    return { noOfItems: items.length, feedTitle: feed.title }
  },
  async fetchSuggested({ commit }) {
    const suggestedFeeds = await db.suggested_feeds.toArray()
    commit('setSuggestedFeeds', suggestedFeeds)
    return suggestedFeeds
  },
  async addFromSuggested({ dispatch, state }, selectedSuggestionIndices) {
    const links = selectedSuggestionIndices.map(
      (suggestionIndex) => state.suggested[suggestionIndex].link
    )
    const addFeedResponse = await Promise.all(
      links.map((link) => dispatch('addFeed', { url: link }))
    )
    // const feedNames = addFeedResponse.map((response) => response.feedTitle)
    // const totalItems = addFeedResponse
    //   .map((response) => response.noOfItems)
    //   .reduce((a, b) => a + b)
    // alert(
    //   `Completed. Added total ${totalItems} articles from ${feedNames.join(
    //     ', '
    //   )}`
    // )
    return addFeedResponse
  },
  async fetchFeedsOnly({ commit }) {
    commit('setFeeds', { feeds: await db.feeds.toArray() })
  },
  fetchAll({ dispatch, state }) {
    dispatch('commitAll')

    try {
      // const parser = new Parser()
      // const feedPromises = state.list.map(({ feedUrl }) => {
      //   return parser.parseURL(CORS_PROXY + feedUrl)
      // })
      // const resolvedfeeds = await Promise.all(feedPromises)
      // const { items, feeds } = parseFeeds(resolvedfeeds)

      // await db.feeds.bulkPut(feeds)
      // await db.items.bulkPut(items)
      // dispatch('commitAll')

      return state.list
    } catch (message) {
      // console.error(message)
    }
  },
  commitAll({ dispatch }) {
    dispatch('items/fetchAll')
    dispatch('fetchFeedsOnly')
    dispatch('stories/fetchAll', null, { root: true })
  },
  async getFeed({ commit }, id) {
    commit('setFeed', await db.feeds.get({ link: decrypt(id) }))
  },
}

export const mutations = {
  setFeeds(state, { feeds }) {
    state.list = feeds
  },
  setFeed(state, feed) {
    state.item = feed
  },
  setSuggestedFeeds(state, suggestedFeeds) {
    state.suggested = suggestedFeeds
  },
}

function isValidHttpUrl(string) {
  let url

  try {
    url = new URL(string)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

function parseFeeds(feeds) {
  const _items = []
  const _feeds = []
  feeds.forEach((feed) => {
    const feedWithoutItems = Object.assign({}, feed, { items: [] })
    _feeds.push(feedWithoutItems)
    _items.push(
      ...feed.items.map((item) =>
        Object.assign(item, { feedTitle: feed.title, feedLink: feed.link })
      )
    )
  })
  return { feeds: _feeds, items: _items }
}

async function findFeedFromURL(url, searchPrefix, callback) {
  if (!isValidHttpUrl(url)) {
    return {
      error:
        'Invalid URL:' + url + '. Please enter a valid URL with http or https.',
    }
  }

  const p = new URL(url)
  // const protocol = p.protocol != null ? p.protocol : 'http:'
  // const domain = protocol + '//' + p.hostname
  const videoPrefix = 'https://www.youtube.com/feeds/videos.xml?channel_id='
  const usualSuspects = [
    '/feed.xml',
    '/rss.xml',
    '/feed',
    '/rss',
    '/atom.xml',
    '.rss',
  ]

  const feed = url.replace(/\/$/, '')
  let res = ''

  if (!p.protocol)
    return { error: null, discovered: searchPrefix + url.split(' ') }

  if (
    p.host.endsWith('youtube.com') &&
    p.path.startsWith('/channel') &&
    p.path.split('/').length === 3
  )
    return { error: null, discovered: videoPrefix + p.path.split('/')[2] }

  async function isRss(u) {
    const response = await fetch(CORS_PROXY + u).catch((e) => {
      return false
    })
    return response.ok && response.headers.get('content-type').includes('xml')
  }

  async function checkSuspects(f) {
    for (const suspect of usualSuspects) {
      if (await isRss(f + suspect)) return f + suspect
    }
    return ''
  }

  async function checkTheDom(url) {
    const response = await fetch(CORS_PROXY + url).catch((e) => {
      return false
    })

    if (response.ok) {
      const feeds = getFeeds(await response.text(), { url })
      if (feeds.length > 0) {
        return feeds[0].href
      }
      return ''
    } else {
      return ''
    }
  }

  async function checkAll() {
    if (await isRss(feed)) {
      return feed
    } else {
      res = await checkTheDom(feed)
      if (res) {
        return res
      } else {
        res = await checkSuspects(feed)
        if (res) {
          return res
        } else {
          return false
        }
      }
    }
  }

  res = await checkAll()
  if (res) return { error: null, discoveredUrl: res }
  else return { error: 'No feed found for url: ' + url }
}
