export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  ssr: true,
  head: {
    title: 'hotel',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '~/assets/styles/index.scss',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/buefy',
    '~/plugins/fas',
    '~/plugins/dateFns'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    '@nuxtjs/axios',
    ['cookie-universal-nuxt', { alias: 'cookies' }],
  ],


  serverMiddleware: {
    '/api': '~/server/index.js'
  },

  middleware: [
    'loadingCookies',
    // for secure route
    'auth',
    'guest',
    // for protected route
    'protected'
  ],

  axios: {
    '/api/': { target: `${process.env.BASE_URL}/api`}
  },
  watch: [
    '~/server'
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false,
        },
      },
    },
  },
}
