// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  //devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ['@nuxtjs/supabase', '@nuxt/ui'],
  supabase: {
    redirect: true,
  },
  runtimeConfig: {
    public: {
      GH_CLIENT_ID: process.env.GH_CLIENT_ID,
      GH_CLIENT_SECRET: process.env.GH_CLIENT_SECRET,
      ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    },
  },
  security: {
    corsHandler: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: '*',
      exposeHeaders: '*',
    },
  },
  ssr: false,
  app: {
    head: {
      title: 'mgrs',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
  tailwindcss: {
    viewer: false,
  },
})

