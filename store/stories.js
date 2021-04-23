import db from "@/plugins/db";

const SLIDE_DURATION = 2000;


export const state = () => ({
    items: [],
    currentStoryIndex: 0
});


export const getters = {

};

export const actions = {
    async fetchAll({ commit }) {
        const groupedFeeds = await getGroupedFeeds()

        const stories = groupedFeeds.map((item) => {
            return Object.assign(item, { action: '' })
        })

        await commit("setStories", { stories });
        return stories;
    },

    async nextStory({ state, commit }) {
        if (state.currentStoryIndex < state.items.length - 1) {
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
            console.log("PREVIOUS_STORY");
            await commit('activateStory')
        }
    }
};

export const mutations = {
    setStories(state, { stories }) {
        state.items = stories;
    },
    setCurrentStoryIndex(state, currentStoryIndex) {
        state.currentStoryIndex = currentStoryIndex;
    },
    activateStory(state) {
        state.items[state.currentStoryIndex].action = 'activate';
    },
    deactivateStory(state) {
        state.items[state.currentStoryIndex].action = 'deactivate';
    },

};



async function getGroupedFeeds() {

    // Query
    const feeds = await db.feeds
        .toArray();

    // using parallel queries:
    await Promise.all(feeds.map(async feed => {
        feed.items = await db.items.where('feedLink')
            .equals(feed.link)
            .reverse().limit(5)
            .sortBy('isoDate');
    }));
    return feeds;
}