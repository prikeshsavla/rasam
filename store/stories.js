import db from "@/plugins/db";
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const STORY_INTERVAL = DAY * 7

export const state = () => ({
    list: [],
    currentStoryIndex: 0
});


export const getters = {

};

export const actions = {
    async fetchAll({ commit }) {

        const groupedFeeds = await getGroupedItems()

        const stories = groupedFeeds.map((item) => {
            return Object.assign(item, { action: '' })
        })

        await commit("setStories", { stories });
        return stories;
    },

    async nextStory({ state, commit }) {
        if (state.currentStoryIndex < state.list.length - 1) {
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
            console.log("Go to Home");
            await commit('activateStory')
            this.$router.push('/')
           
        }
    }
};

export const mutations = {
    setStories(state, { stories }) {
        state.list = stories;
    },
    setCurrentStoryIndex(state, currentStoryIndex) {
        state.currentStoryIndex = currentStoryIndex;
    },
    activateStory(state) {
        state.list[state.currentStoryIndex].action = 'activate';
    },
    deactivateStory(state) {
        state.list[state.currentStoryIndex].action = 'deactivate';
    },

};



async function getGroupedItems(afterDate = (new Date() - STORY_INTERVAL)) {

    // Query
    const feeds = await db.feeds
        .toArray();

    // using parallel queries:
    await Promise.all(feeds.map(async feed => {
        feed.items = await db.items.where('feedLink')
            .equals(feed.link)
            .and(function (item) { return new Date(item.isoDate) > afterDate })
            .reverse()
            .sortBy('isoDate');
    }));

    return feeds.filter((feed) => feed.items.length > 0);
}