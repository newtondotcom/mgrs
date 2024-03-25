// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ['@nuxtjs/supabase','@nuxt/ui'],
  supabase: {
    redirect: true,
  },
  runtimeConfig: {
    public : {
      GITHUB_CLIENT_ID : process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET : process.env.GITHUB_CLIENT_SECRET,
    },
  },
  security: {
    corsHandler: {
      origin : '*',
      methods : ['GET','POST','PUT','DELETE'],
      allowedHeaders : '*',
      exposeHeaders : '*',
    },
  },
})
  
