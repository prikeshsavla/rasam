import Parser from 'rss-parser'
import getFeeds from 'get-feeds'
import db from '@/services/db'
import { decrypt } from '~/services/crypt'
const CORS_PROXY = 'https://api.allorigins.win/raw?url='

export const state = () => ({
  list: [],
  item: null,
  stories: [],
  suggested: [
    {
      contentSnippet: `A journey to find new and inspiring open-source libraries with a touch of India's food, people and culture.`,
      title: 'Open Pull Request',
      link: 'https://openpullrequest.substack.com/rss',
    },
    {
      contentSnippet: `Best known for the Hot 100 and Billboard 200, which list the most popular songs and albums each week in the industry. Offers industry news, events, podcasts, and music streaming.`,
      title: 'Billboard',
      link: 'https://www.billboard.com/',
    },
    {
      contentSnippet:
        'Podcasts, interviews, videos, and photo galleries covering the latest entertainment news in Australia and around the world. Articles primarily cover celebrity lifestyle, focusing on health, beauty, fashion, as well as travel.',
      title: 'TMZ',
      link: 'https://www.tmz.com/',
    },
    {
      contentSnippet:
        'Find business news, webinars and events, book recommendations, and interviews with successful entrepreneurs. The site is updated daily and even has a magazine for longer-form pieces.',
      title: 'Entrepreneur',
      link: 'https://www.entrepreneur.com/',
    },
    {
      contentSnippet:
        'The Verge is an ambitious multimedia effort founded nine years ago to examine how technology will change life in the future for a massive mainstream audience.',
      title: 'The Verge',
      link: 'https://www.theverge.com/',
    },
    {
      contentSnippet:
        "We're all about bending the rules and defying the norm, and to make science and technology a whole lot more fun!",
      title: 'Nibbles of Noteworthy Nonsense',
      link: 'https://bytes.absurd.industries/rss/',
    },
  ],
})

export const getters = {}

export const actions = {
  async addFeed({ dispatch }, { url }) {
    try {
      const parser = new Parser()
      const requestFeedUrl = url.replace(/\/$/, '')

      const { error, discoveredUrl } = await findFeedFromURL(requestFeedUrl)
      if (error) {
        console.error(error)
        return false
      }

      const feed = await parser.parseURL(CORS_PROXY + discoveredUrl)
      const { items } = parseFeeds([feed])

      const feedWithoutItems = Object.assign({}, feed, {
        items: [],
        feedUrl: discoveredUrl,
      })

      await db.feeds.put(feedWithoutItems)
      await db.items.bulkPut(items)

      await dispatch('saveFeedsAndItems')
      return { noOfItems: items.length, feedTitle: feed.title }
    } catch (error) {
      console.error(error)
      return false
    }
  },
  async addFromSuggested({ dispatch, state }, selectedSuggestionIndices) {
    const links = selectedSuggestionIndices.map(
      (suggestionIndex) => state.suggested[suggestionIndex].link
    )
    const addFeedResponse = await Promise.all(
      links.map((link) => dispatch('addFeed', { url: link }))
    )
    return addFeedResponse
  },
  async fetchFeedsOnly({ commit, state }) {
    await commit('setFeeds', { feeds: await db.feeds.toArray() })
    return state.list
  },
  async fetchAll({ dispatch, commit, state }) {
    await commit('settings/setLoading', true, { root: true })
    await dispatch('saveFeedsAndItems')

    try {
      await loadFeedItems(state)
      dispatch('saveFeedsAndItems')
    } catch (message) {
      console.error(message)
    } finally {
      await commit('settings/setLoading', false, { root: true })
    }
    return state.list
  },

  async deleteFeed({ dispatch, commit }, id) {
    await dispatch('items/deleteByFeed', id, { root: true })
    await db.feeds.delete(decrypt(id))
    await commit('setFeed', null)
    await dispatch('saveFeedsAndItems')
  },

  async saveFeedsAndItems({ dispatch }) {
    await dispatch('fetchFeedsOnly')
    await dispatch('items/fetchAll', {}, { root: true })
    dispatch('stories/fetchAll', null, { root: true })
  },
  async getFeed({ commit }, id) {
    commit('setFeed', await db.feeds.get({ link: decrypt(id) }))
  },
  async saveTitle({ dispatch }, { title, id }) {
    await db.feeds.update(decrypt(id), { title })
    await dispatch('getFeed', id)
  },
  async saveDescription({ dispatch }, { description, id }) {
    await db.feeds.update(decrypt(id), { description })
    await dispatch('getFeed', id)
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

async function loadFeedItems(state) {
  const parser = new Parser()
  const feedPromises = state.list.map(({ feedUrl }) => {
    return parser.parseURL(CORS_PROXY + feedUrl)
  })
  const resolvedFeeds = await Promise.all(feedPromises)
  const { items } = parseFeeds(resolvedFeeds)
  await db.items.bulkPut(items)
}

function isValidHttpUrl(string) {
  let url

  try {
    url = new URL(string)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (_) {
    return false
  }
}

function parseFeeds(feeds) {
  const _items = []
  const _feeds = []
  feeds.forEach((feed) => {
    _feeds.push(Object.assign({}, feed, { items: [] }))
    _items.push(
      ...feed.items.map((item) =>
        Object.assign(item, {
          feedTitle: feed.title,
          feedLink: feed.link,
          guid: item.guid || item.id || item.link,
        })
      )
    )
  })
  return { feeds: _feeds, items: _items }
}

async function findFeedFromURL(url) {
  if (!isValidHttpUrl(url)) {
    return {
      error:
        'Invalid URL:' + url + '. Please enter a valid URL with http or https.',
    }
  }
  const feed = url.replace(/\/$/, '')

  const res = await checkAll(feed)
  if (res) return { error: null, discoveredUrl: res }

  return { error: 'No feed found for url: ' + url }
}

async function isRss(u) {
  const response = await fetch(CORS_PROXY + u).catch((e) => {
    return false
  })
  if (response.ok) {
    const content = await response.text()
    return (
      response.headers.get('content-type').includes('xml') ||
      content.startsWith('<?xml')
    )
  } else {
    return false
  }
}

async function checkSuspects(f) {
  const usualSuspects = [
    '/feed.xml',
    '/rss.xml',
    '/feed',
    '/rss',
    '/atom.xml',
    '/feed',
    '.rss',
  ]
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
  }
  return ''
}

async function checkAll(feed) {
  if (await isRss(feed)) {
    return feed
  }
  const urlInDOM = await checkTheDom(feed)
  if (urlInDOM) {
    return urlInDOM
  }
  return await checkSuspects(feed)
}
