import Dexie from 'dexie';

const db = new Dexie('rasam');
db.version(1).stores({
    posts: `++id, title, content, isoDate, author, link, feed_id`,
    feeds: `++id, title, link`,
});

export default db;