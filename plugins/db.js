import Dexie from 'dexie';

const db = new Dexie('rasam');
db.version(1).stores({
    items: `link, title, content, isoDate, author, feedLink`,
    feeds: `link, title, lastBuildDate, feedUrl`,
});

export default db;