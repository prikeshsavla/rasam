import Dexie from 'dexie'

const db = new Dexie('rasam')
db.version(3).stores({
  items: `link, title, content, isoDate, author, feedLink`,
  feeds: `link, title, lastBuildDate, feedUrl`,
  likes: `link, likedAt`,
  suggested_feeds: `link, title, contentSnipped, image`,
  settings: 'name, value',
})

db.suggested_feeds.bulkPut([
  {
    contentSnippet: `A journey to find new and inspiring open-source libraries with a touch of India's food, people and culture.`,
    title: 'Open Pull Request',
    link: 'https://openpullrequest.substack.com/',
  },
  {
    contentSnippet: `Best known for the Hot 100 and Billboard 200, which list the most popular songs and albums each week in the industry. Offers industry news, events, podcasts, and music streaming.`,
    title: 'Billboard',
    link: 'https://www.billboard.com/',
  },
  {
    contentSnippet: `High-end business journalism keeping readers up-to-date on economic news as well as interviews with top entrepreneurs. There’s also educated predictions, trend analyses, and tips on how to improve businesses.`,
    title: 'Business Insider',
    link: 'https://www.businessinsider.com/',
  },
  {
    contentSnippet:
      'Podcasts, interviews, videos, and photo galleries covering the latest entertainment news in Australia and around the world. Articles primarily cover celebrity lifestyle, focusing on health, beauty, fashion, as well as travel.',
    title: 'TMZ',
    link: 'https://www.tmz.com/',
  },
  {
    contentSnippet:
      'Find business news, webinars and events, book recommendations, and interviews with successful entrepreneurs. The site is updated daily and even has a magazine for longer-form pieces.',
    title: 'Entrepreneur',
    link: 'https://www.entrepreneur.com/',
  },
  {
    contentSnippet:
      'The Verge is an ambitious multimedia effort founded nine years ago to examine how technology will change life in the future for a massive mainstream audience.',
    title: 'The Verge',
    link: 'https://www.theverge.com/',
  },
  {
    contentSnippet: `Standout voice in pop culture and music delivering top news across artists, albums, film, TV, and video. Online gig guide, shop, and radio access covering the latest.`,
    title: 'NME',
    link: 'https://www.nme.com/',
  },
  {
    contentSnippet: `A long-standing news source that covers entertainment as well as current events. Articles are relevant and accessible, while a free streaming network keeps people in touch with the latest developments.`,
    title: 'Page Six',
    link: 'https://pagesix.com/',
  },
  {
    contentSnippet:
      'With an editorial focus on innovation in technology, world changing ideas, leadership, creativity, and design, FastCompany gives readers both economic news and advice on how to better grow their business.',
    title: 'Fast Company',
    link: 'https://www.fastcompany.com/',
  },

  {
    contentSnippet:
      'Seeking Alpha is an investing community which includes millions of passionate investors who connect daily to discover and share new investing ideas, discuss the latest news, debate the merits of stocks, and make informed investment decisions.',
    title: 'Seeking Alpha',
    link: 'https://seekingalpha.com/',
  },
])

export default db
