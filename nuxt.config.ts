// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  runtimeConfig: {
    public: {
      apiBase: 'https://dummyjson.com'
    }
  },

  typescript: {
    strict: true,
    typeCheck: false
  },

  app: {
    head: {
      title: 'Product Management - MGi',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sistema de gestión de productos' }
      ]
    }
  },

  css: [
    '~/assets/css/main.css',
    'vue-toastification/dist/index.css'
  ],

  vite: {
    optimizeDeps: {
      exclude: ['#app-manifest']
    }
  },
    nitro: {
    preset: 'vercel'
  }
})