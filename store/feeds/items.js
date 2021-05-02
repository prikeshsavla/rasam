import db from '@/plugins/db'
import { decrypt } from '@/plugins/crypt'
export const state = () => ({
  list: [],
  item: {},
  page: 1,
  show: 20,
})

export const getters = {
  paginatedList(state) {
    return state.list.slice(0, state.page * state.show)
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
  async getItemByID({ commit, state }, id) {
    const item = await db.items.get({ link: decrypt(id) })
    await commit('setItem', item)
    return item
  },
  async likeItem({ commit, dispatch }, { link, liked }) {
    const likesItem = { link, likedAt: liked ? new Date() : null }
    if (liked) {
      const likesItem = { link, likedAt: new Date() }
      await db.likes.put(likesItem)
    } else {
      await db.likes.where('link').equals(link).delete()
    }
    await dispatch('fetchAll')
    await commit(
      'setItem',
      Object.assign({}, state.item, { likedAt: likesItem.likedAt })
    )
    return state.item
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
  setPage(state, page) {
    state.page = page || 1
  },
}
