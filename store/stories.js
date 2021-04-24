import db from "@/plugins/db";
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const STORY_INTERVAL = DAY * 7

export const state = () => ({
    items: [],
    currentStoryIndex: 0
});


export const getters = {

};

export const actions = {
    async fetchAll({ commit }) {
        const groupedFeeds = await getStories()

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
            console.log("Go to Home");
            this.$router.push('/')
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



async function getStories(afterDate = (new Date() - STORY_INTERVAL)) {

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
    console.log(feeds)

    return feeds.filter((feed) => feed.items.length > 0);
}