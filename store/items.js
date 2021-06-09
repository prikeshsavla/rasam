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
    if (feedId) {
      await commit('setFeedId', feedId)
    }
    if (onlyLiked) {
      await commit('setOnlyLiked', onlyLiked)
    }

    const list = await getList(state)
    await Promise.all(list.map(resolveLike))

    commit('setList', list)
    commit('setTotalItems', list.length)
    return state.list
  },

  async getItemByID({ commit }, id) {
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
  setList(state, list) {
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

async function resolveLike(item) {
  const likedItem = await db.items.get({ guid: item.guid })
  Object.assign(item, likedItem)
  return item
}

async function getList(state) {
  if (state.feedId) {
    return await db.items
      .where('feedLink')
      .equals(decrypt(state.feedId))
      .reverse()
      .sortBy('isoDate')
  } else if (state.onlyLiked) {
    const list = await db.likes.toArray()
    await Promise.all(
      list.map(async (item) => {
        const likedItem = await db.items.get({ guid: item.guid })
        Object.assign(item, likedItem)
        return item
      })
    )
    return list
  } else {
    return await db.items.orderBy('isoDate').reverse().toArray()
  }
}
