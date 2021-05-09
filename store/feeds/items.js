import db from '@/plugins/db'
import { decrypt } from '@/plugins/crypt'
import Fuse from 'fuse.js'

export const state = () => ({
  list: [],
  totalItems: 0,
  item: null,
  page: 1,
  show: 30,
  query: '',
  feedId: null,
  onlyLiked: false,
})

export const getters = {
  paginatedList(state) {
    return state.list.slice(0, state.page * state.show)
  },
  searchResults(state) {
    // 2. Set up the Fuse instance
    const fuse = new Fuse(state.list, {
      keys: [
        'title',
        'content',
        'contentSnippet',
        'link',
        'guid',
        'author',
        'feedTitle',
        'isoDate',
      ],
    })
    const searchResults = fuse.search(state.query, {})
    return searchResults.map(({ item }) => item)
  },
  pages(state) {
    return Math.ceil(state.totalItems / state.show)
  },
}

export const actions = {
  async fetchAll({ state, commit }, { feedId, onlyLiked }) {
    let items = []
    let totalItems = 0

    if (feedId) {
      await commit('setFeedId', feedId)
    }
    if (onlyLiked) {
      await commit('setOnlyLiked', onlyLiked)
    }
    if (state.feedId) {
      items = await db.items
        .where('feedLink')
        .equals(decrypt(state.feedId))
        .reverse()
        .sortBy('isoDate')

      totalItems = await db.items
        .where('feedLink')
        .equals(decrypt(state.feedId))
        .count()
    } else if (state.onlyLiked) {
      items = await db.likes.toArray()
      await Promise.all(
        items.map(async (item) => {
          const likedItem = await db.items.get({ guid: item.guid })
          Object.assign(item, likedItem)
          return item
        })
      )

      totalItems = items.length
    } else {
      items = await db.items.orderBy('isoDate').reverse().toArray()

      totalItems = await db.items.count()
    }

    await Promise.all(
      items.map(async (item) => {
        const likesItem = await db.likes.get({ guid: item.guid })
        item.likedAt = likesItem ? likesItem.likedAt : null
        return item
      })
    )

    commit('setItems', items)
    commit('setTotalItems', totalItems)
    return state.list
  },

  async getItemByID({ commit, state }, id) {
    const item = await db.items.get({ guid: decrypt(id) })

    const likesItem = await db.likes.get({ guid: item.guid })
    item.likedAt = likesItem ? likesItem.likedAt : null

    await commit('setItem', item)
    return item
  },
  async likeItem({ commit }, { guid, liked }) {
    let likesItem = { guid, likedAt: liked ? new Date() : null }

    if (liked) {
      likesItem = { guid, likedAt: liked ? new Date() : null }
      await db.likes.put(likesItem)
    } else {
      await db.likes.where('guid').equals(guid).delete()
    }

    await commit('setItemLikedAt', likesItem)
    return likesItem
  },
  async nextPage({ state, commit }) {
    const maxPages = Math.ceil(state.totalItems / state.show)

    if (state.page + 1 <= maxPages) {
      await commit('incrementPageBy', 1)
    }
  },
}

export const mutations = {
  setItems(state, list) {
    state.list = list || []
  },
  setItem(state, item) {
    state.item = item
  },
  setItemLikedAt(state, { guid, likedAt }) {
    state.item = Object.assign({}, state.item, { likedAt })
    if (state.list.length > 0) {
      const itemIndex = state.list
        .map((listItem) => listItem.guid)
        .indexOf(guid)
      state.list[itemIndex].likedAt = likedAt
    }
  },
  setPage(state, page) {
    state.page = page || 1
  },
  incrementPageBy(state, incrementBy) {
    state.page = state.page + incrementBy
  },
  setQuery(state, { query }) {
    state.query = query || ''
  },
  setFeedId(state, feedId) {
    state.feedId = feedId
  },
  setOnlyLiked(state, onlyLiked) {
    state.onlyLiked = onlyLiked
  },
  setTotalItems(state, totalItems) {
    state.totalItems = totalItems
  },
}
