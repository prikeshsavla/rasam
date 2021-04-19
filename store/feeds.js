function parseFeeds(feeds) {

    let _items = [];
    feeds.forEach(feed => {
        _items.push(...feed.items.map((item) => Object.assign(item, { feed })))
    });
    return _items
}

export const state = () => ({
    items: [],
    feeds: []
});

export const actions = {

    async fetchAll({ commit, state }) {

        const RSS_URLS = [
            "https://world.hey.com/dhh/feed.atom",
            "https://openpullrequest.substack.com/feed",
        ];
        let Parser = require("rss-parser");
        let parser = new Parser();
        const feedPromises = RSS_URLS.map((url) => {
            return parser.parseURL('https://cors-anywhere.herokuapp.com/' + url);
        });
        try {
            const feeds = await Promise.all(feedPromises);
            const items = parseFeeds(feeds);

            // Save to DB

            commit("setItems", { items });
            commit("setFeeds", { feeds });
            return state.items;
        } catch (message) {
            return console.log(message);
        }
    },
};

export const mutations = {
    setItems(state, { items }) {
        state.items = items;
    },
    setFeeds(state, { feeds }) {
        state.feeds = feeds;
    },
};
