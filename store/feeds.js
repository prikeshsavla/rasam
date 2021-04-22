import db from "@/plugins/db";
import Parser from 'rss-parser';
import getFeeds from 'get-feeds';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export const state = () => ({
    items: [],
    feeds: [],
    groupedFeeds: []
});


export const getters = {
    authUser(state) {
        return state.user || null;
    },
    isAuthenticated(state) {
        return !!state.user;
    },
    isAdmin(state) {
        return state.user && state.user.role && state.user.role === "admin";
    },
};

export const actions = {
    async getItemsGroupedByFeeds({ commit }) {
        const groupedFeeds = await getGroupedFeeds()
        commit("setGroupedFeeds", { groupedFeeds });
        return groupedFeeds;
    },
    async addFeed({ commit }, { url }) {

        let parser = new Parser();

        console.log("Feeds")
        var requestFeedUrl = url.replace(/\/$/, "");

        parseURL(requestFeedUrl, '', async (error, discoveredUrl) => {
            if (error) {
                return console.log(error)
            }

            const feedResponse = await parser.parseURL(CORS_PROXY + discoveredUrl);
            const feed = {
                title: feedResponse.title,
                link: feedResponse.link,
                lastBuildDate: feedResponse.lastBuildDate,
                feedUrl: feedResponse.feedUrl
            }
            const items = feedResponse.items.map((item) => Object.assign(item, { feedTitle: feed.title, feedLink: feed.link }))
            console.log(feedResponse);
            console.log(feed);
            console.log(items);

            await db.feeds.put(feed)
            await db.items.bulkPut(items)
            commit("setFeeds", { feeds: (await db.feeds.toArray()) });
            commit("setItems", { items: (await db.items.orderBy('isoDate').reverse().toArray()) });
        });



    },

    async fetchAll({ commit, state }) {
        commit("setFeeds", { feeds: (await db.feeds.toArray()) });
        commit("setItems", { items: (await db.items.orderBy('isoDate').reverse().toArray()) });
        const groupedFeeds = await getGroupedFeeds();
        commit("setGroupedFeeds", { groupedFeeds });
        let parser = new Parser();
        const feedPromises = state.feeds.map(({ feedUrl }) => {
            return parser.parseURL('https://cors-anywhere.herokuapp.com/' + feedUrl);
        });
        try {
            const resolvedfeeds = await Promise.all(feedPromises);
            const { items, feeds } = parseFeeds(resolvedfeeds);

            // Save to DB

            await db.feeds.bulkPut(feeds);
            await db.items.bulkPut(items);
            commit("setFeeds", { feeds: (await db.feeds.toArray()) });
            commit("setItems", { items: (await db.items.orderBy('isoDate').reverse().toArray()) });
            return state.feeds;
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
    setGroupedFeeds(state, { groupedFeeds }) {
        state.groupedFeeds = groupedFeeds;
    },
};



function parseFeeds(feeds) {

    let _items = [];
    let _feeds = [];
    feeds.forEach(({ title, link, lastBuildDate, feedUrl, items }) => {
        _feeds.push({ title, link, lastBuildDate, feedUrl })
        _items.push(...items.map((item) => Object.assign(item, { feedTitle: title, feedLink: link })))
    });
    return { feeds: _feeds, items: _items }
}

function parseURL(url, searchPrefix, callback) {
    const p = new URL(url),
        protocol = p.protocol != null ? p.protocol : 'http:',
        domain = protocol + "//" + p.hostname,
        videoPrefix = 'https://www.youtube.com/feeds/videos.xml?channel_id=',
        usualSuspects = ['/feed.xml',
            '/rss.xml',
            '/feed',
            '/rss',
            '/atom.xml',
            '.rss'
        ];

    var feed = url.replace(/\/$/, "");
    var res = '';

    if (!p.protocol) return callback(null, searchPrefix + url.split(' '));

    if (p.host.endsWith('youtube.com') && p.path.startsWith('/channel') && p.path.split('/').length === 3)
        return callback(null, videoPrefix + p.path.split('/')[2]);

    async function isRss(u) {
        const response = await fetch(CORS_PROXY + u).catch(e => { return false; });
        return response.ok && response.headers.get('content-type').includes('xml');
    }

    async function checkSuspects(f) {
        for (const suspect of usualSuspects) {
            if (await isRss(f + suspect)) return f + suspect;
        }
        return "";
    }

    async function checkTheDom(url) {

        const response = await fetch(CORS_PROXY + url).catch(e => { return false; });;

        if (response.ok) {
            const feeds = getFeeds(await response.text(), { url: url })
            if (feeds.length > 0) {
                return feeds[0].href;
            }
            return "";
        } else {
            return "";
        }

    }

    async function checkAll() {
        if (await (isRss(feed))) {
            console.log("Check base")
            return feed;
        } else {
            console.log("Check Dom")
            res = await checkTheDom(feed);
            if (res) {
                return res;
            } else {
                console.log("Check Suspects")
                res = await checkSuspects(feed);

                if (res) {
                    return res;
                } else {
                    return false;
                }
            }
        }
    }

    (async function () {
        res = await (checkAll());
        if (res)
            return callback(null, res);
        else
            return callback('No feed found');
    })();


}


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