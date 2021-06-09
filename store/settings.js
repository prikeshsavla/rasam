import db from '~/plugins/db'

export const state = () => ({
  settings: [],
  loading: false,
})

export const getters = {}

export const actions = {
  async set({ commit }, setting) {
    await db.settings.put(setting)
    commit('setSettings', setting)
    return setting
  },
  async fetchAll({ commit }) {
    const settings = await db.settings.toArray()
    commit('setSettings', settings)
    return settings
  },
  async get({ dispatch, state }, settingName) {
    await dispatch('fetchAll')
    const settingIndex = state.settings
      .map(({ name }) => name)
      .indexOf(settingName)
    if (settingIndex !== -1) {
      return state.settings[settingIndex].value
    } else {
      return false
    }
  },
}

export const mutations = {
  setSetting(state, setting) {
    const settingIndex = state.settings
      .map(({ name }) => name)
      .indexOf(setting.name)
    if (settingIndex !== -1) {
      state.settings[settingIndex].value = setting.value
    } else {
      state.settings.push(setting)
    }
  },
  setSettings(state, settings) {
    state.settings = settings
  },
  setLoading(state, loading) {
    state.loading = loading
  },
}
