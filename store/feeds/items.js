import db from '@/plugins/db'
import { decrypt } from '@/plugins/crypt'
import Fuse from 'fuse.js'

export const state = () => ({
  list: [],
  item: {},
  page: 1,
  show: 15,
  query: '',
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
        'author',
        'feedTitle',
        'isoDate',
      ],
    })
    const searchResults = fuse.search(state.query, {})
    return searchResults.map(({ item }) => item)
  },
  pages(state) {
    return Math.ceil(state.list.length / state.show)
  },
}

export const actions = {
  async fetchAll({ commit }) {
    const items = await db.items.orderBy('isoDate').reverse().toArray()

    // using parallel queries:
    await Promise.all(
      items.map(async (item) => {
        const likesItem = await db.likes.get({ link: item.link })
        item.likedAt = likesItem ? likesItem.likedAt : null
      })
    )
    commit('setItems', items)
    return state.list
  },
  async fetchAllForFeed({ commit }, id) {
    const items = await db.items
      .where('feedLink')
      .equals(decrypt(id))
      .reverse()
      .sortBy('isoDate')

    // using parallel queries:
    await Promise.all(
      items.map(async (item) => {
        const likesItem = await db.likes.get({ link: item.link })
        item.likedAt = likesItem ? likesItem.likedAt : null
      })
    )
    commit('setItems', items)
    return state.list
  },
  async getItemByID({ commit, state }, id) {
    const item = await db.items.get({ link: decrypt(id) })
    await commit('setItem', item)
    return item
  },
  async likeItem({ commit }, { link, liked }) {
    const likesItem = { link, likedAt: liked ? new Date() : null }
    if (liked) {
      const likesItem = { link, likedAt: new Date() }
      await db.likes.put(likesItem)
    } else {
      await db.likes.where('link').equals(link).delete()
    }
    await commit('setItemLikedAt', likesItem)
    return likesItem
  },
  nextPage({ state, commit }) {
    const maxPages = Math.ceil(state.list.length / state.show)
    if (state.page + 1 <= maxPages) {
      commit('setPage', state.page + 1)
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
  setItemLikedAt(state, { link, likedAt }) {
    if (state.list.length > 0) {
      const itemIndex = state.list
        .map((listItem) => listItem.link)
        .indexOf(link)
      state.list[itemIndex].likedAt = likedAt
    }
    state.item.likedAt = likedAt
  },
  setPage(state, page) {
    state.page = page || 1
  },
  setQuery(state, { query }) {
    state.query = query || ''
  },
}
