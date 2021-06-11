import Dexie from 'dexie'

const db = new Dexie('rasam')
db.version(4).stores({
  items: `guid, link, title, content, isoDate, author, feedLink`,
  feeds: `link, title, lastBuildDate, feedUrl`,
  likes: `guid, likedAt`,
  settings: 'name, value',
})

export default db
