import Dexie from 'dexie'

const db = new Dexie('rasam')
db.version(2).stores({
  items: `link, title, content, isoDate, author, feedLink`,
  feeds: `link, title, lastBuildDate, feedUrl`,
  likes: `link, likedAt`,
})

export default db
