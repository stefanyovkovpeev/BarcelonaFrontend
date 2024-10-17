export default defineNuxtConfig({
  compatibilityDate: '2024-10-15',
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE, 
    },
    private: {
      apiSecret: process.env.NUXT_API_SECRET, 
    },
  },
  modules: ['@sidebase/nuxt-auth'],
  build: {
    transpile: ['jsonwebtoken']
  },
  auth: {
    provider: {
      type: 'local',
      endpoints: {
        getSession: { path: '/user' }
      },
      pages: {
        login: '/login'
      },
      token: {
        signInResponseTokenPointer: '/token/accessToken'
      },
      session: {
        dataType: { id: 'string', email: 'string', name: 'string', role: '\'admin\' | \'guest\' | \'account\'', subscriptions: '{ id: number, status: \'ACTIVE\' | \'INACTIVE\' }[]' },
        dataResponsePointer: '/'
      },
      refresh: {
        isEnabled: process.env.NUXT_AUTH_REFRESH_ENABLED !== 'false',
        endpoint: { path: '/refresh', method: 'post' },
        token: {
          signInResponseRefreshTokenPointer: '/token/refreshToken',
          refreshRequestTokenPointer: '/refreshToken'
        },
      }
    },
    sessionRefresh: {
      enableOnWindowFocus: false,
      enablePeriodically:false ,
    },
    globalAppMiddleware: {
      isEnabled: true
    }
  },
  routeRules: {
    '/with-caching': {
      swr: 86400000,
      auth: {
        disableServerSideAuth: true
      }
    }
  }
})