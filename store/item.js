import db from "@/plugins/db";


export const state = () => ({
    item: {}
});


export const getters = {

};

export const actions = {
    async getItem({ commit }, link) {
        const item = await db.items.get({ link: link });
        commit('setItem', item)
        return item
    }
};

export const mutations = {
    setItem( state, item) {
        state.item = item
    }
};

