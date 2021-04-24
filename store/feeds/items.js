import db from "@/plugins/db";
import {decrypt} from "@/plugins/crypt";
export const state = () => ({
    list: [],
    item: {}
});

export const getters = {

};

export const actions = {
    async fetchAll({ commit }) {
        const items = await db.items.orderBy('isoDate').reverse().toArray();

        // using parallel queries:
        await Promise.all(items.map(async item => {
            const likesItem = await db.likes.get({ link: item.link });
            item.likedAt = likesItem ? likesItem.likedAt : null;
        }));
        commit("setItems", items);
        return state.list
    },
    async getItemByID({ commit, state }, id) {
        const item = await db.items.get({ link: decrypt(id) });
        await commit('setItem', item)
        return item
    },
    async likeItem({ commit, dispatch }, { link, liked }) {

        const likesItem = { link: link, likedAt: liked ? new Date() : null }
        if (liked) {
            const likesItem = { link: link, likedAt: new Date() }
            await db.likes.put(likesItem);
        } else {
            await db.likes.where('link').equals(link).delete();
        }
        await dispatch('fetchAll');
        await commit('setItem', Object.assign({}, state.item, { likedAt: likesItem.likedAt }))
        return state.item
    },
};

export const mutations = {
    setItems(state, items) {
        state.list = items;
    },
    setItem(state, item) {
        state.item = item
    }
};

