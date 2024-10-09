export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: '/api/auth',
    },
    privateKey: process.env.AUTH_SECRET,
  },
  plugins: [
    '~/plugins/auth-fetch.client.js', 
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    '@sidebase/nuxt-auth',
  ],

  auth: {
    // Configuration for '@sidebase/nuxt-auth' should go here
    provider: {
      type: 'authjs',
    },
    globalAppMiddleware: true,
    baseURL: `http://localhost:${process.env.PORT || 3000}`,
  },

  routeRules: {
    '/with-caching': {
      swr: 86400000,
      auth: {
        disableServerSideAuth: false,
      },
    },
  },
  compatibilityDate: '2024-10-05',
});