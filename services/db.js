import Dexie from 'dexie'
import dexieCloud from "dexie-cloud-addon";

const db = new Dexie('rasam', {addons: [dexieCloud]})
db.version(4).stores({
  items: `guid, link, title, content, isoDate, author, feedLink`,
  feeds: `link, title, lastBuildDate, feedUrl`,
  likes: `guid, likedAt`,
  settings: 'name, value',
})

db.cloud.configure({
  databaseUrl: "https://zafs6jdr1.dexie.cloud",
  requireAuth: false, // optional
});

export default db
