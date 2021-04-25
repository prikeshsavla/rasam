import db from "@/plugins/db";
import Parser from 'rss-parser';
import getFeeds from 'get-feeds';
const CORS_PROXY = window.location.hostname === "localhost"
    ? "https://api.allorigins.win/raw?url="
    : "https://api.allorigins.win/raw?url=";

export const state = () => ({
    list: []
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
    async addFeed({ commit, dispatch }, { url }) {

        let parser = new Parser();
        var requestFeedUrl = url.replace(/\/$/, "");

        const { error, discoveredUrl } = await findFeedFromURL(requestFeedUrl, '');
        if (error) {
            alert(error);
            return console.log(error)
        }
        const feed = await parser.parseURL(CORS_PROXY + discoveredUrl);
        const items = feed.items.map((item) => Object.assign(item, { feedTitle: feed.title, feedLink: feed.link }))
        const feedWithoutItems = Object.assign({}, feed, { items: [] })
        await db.feeds.put(feedWithoutItems)
        await db.items.bulkPut(items)
        commit("setFeeds", { feeds: (await db.feeds.toArray()) });
        dispatch('items/fetchAll')
        alert(`${items.length} articles of ${feed.title} added`);
    },

    async fetchAll({ commit, dispatch, state }) {
        commit("setFeeds", { feeds: (await db.feeds.toArray()) });
        dispatch('items/fetchAll')
        let parser = new Parser();
        const feedPromises = state.list.map(({ feedUrl }) => {
            return parser.parseURL(CORS_PROXY + feedUrl);
        });
        try {
            const resolvedfeeds = await Promise.all(feedPromises);
            const { items, feeds } = parseFeeds(resolvedfeeds);

            // Save to DB

            await db.feeds.bulkPut(feeds);
            await db.items.bulkPut(items);
            commit("setFeeds", { feeds: (await db.feeds.toArray()) });
            dispatch('items/fetchAll')
            return state.list;
        } catch (message) {
            return console.log(message);
        }
    },
};

export const mutations = {
    setFeeds(state, { feeds }) {
        state.list = feeds;
    }
};
function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}


function parseFeeds(feeds) {

    let _items = [];
    let _feeds = [];
    feeds.forEach((feed) => {
        const feedWithoutItems = Object.assign({}, feed, { items: [] })
        _feeds.push(feedWithoutItems)
        _items.push(...feed.items.map((item) => Object.assign(item, { feedTitle: feed.title, feedLink: feed.link })))
    });
    return { feeds: _feeds, items: _items }
}

async function findFeedFromURL(url, searchPrefix, callback) {
    if (!isValidHttpUrl(url)) {
        return { error: 'Invalid URL:' + url + '. Please enter a valid URL with http or https.' }
    }

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

    if (!p.protocol) return { error: null, discovered: searchPrefix + url.split(' ') };

    if (p.host.endsWith('youtube.com') && p.path.startsWith('/channel') && p.path.split('/').length === 3)
        return { error: null, discovered: videoPrefix + p.path.split('/')[2] };

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
            return feed;
        } else {
            res = await checkTheDom(feed);
            if (res) {
                return res;
            } else {
                res = await checkSuspects(feed);
                if (res) {
                    return res;
                } else {
                    return false;
                }
            }
        }
    }


    res = await checkAll();
    if (res)
        return { error: null, discoveredUrl: res };
    else
        return { error: 'No feed found' };
}