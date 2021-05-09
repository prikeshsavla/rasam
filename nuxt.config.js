import colors from 'vuetify/lib/util/colors'
export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'rasam',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900',
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@mdi/font/css/materialdesignicons.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // // https://go.nuxtjs.dev/tailwindcss
    // '@nuxtjs/bulma',
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
    // https://github.com/nuxt-community/vuetify-module
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
      crossorigin: 'anonymous',
      share_target: {
        action: '/share',
        method: 'GET',
        params: {
          title: 'title',
          text: 'text',
          url: 'url',
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  generate: {
    fallback: true,
  },

  vuetify: {
    defaultAssets: true,
    theme: {
      themes: {
        light: {
          primary: 'E37C43', // #E53935
          secondary: 'F3F4F6', // #FFCDD2
          accent: 'F0EFE8', // #FFCDD2
        },
      },
    },
  },
}
