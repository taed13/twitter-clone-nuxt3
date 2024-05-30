import { defineNuxtConfig } from 'nuxt/config'
import themeConfigJson from './tailwind/theme.config.json'

export const runtimeConfig = {
  public: {
    ENVIRONMENT: process.env.ENVIRONMENT || '',
    TAILWIND_SCREENS: themeConfigJson.screens || {},
  },
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  telemetry: false,
  ssr: false,
  srcDir: 'src/',
  app: {
    buildAssetsDir: '/assets',
    head: {
      title: '「意外と簡単なんです！ Twitter ソーシャル ネットワークを作成する',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.ico' }],
    },
  },
  modules: ['nuxt-graphql-client', '@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/eslint-module'],
  runtimeConfig,
  sourcemap: {
    server: true,
    client: true,
  },
  vite: {
    build: {
      sourcemap: 'hidden',
    },
  },
  devtools: { enabled: true },
  css: ['@fortawesome/fontawesome-svg-core/styles.css', '@/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': {},
      'postcss-advanced-variables': {
        variables: {},
      },
      tailwindcss: {},
      autoprefixer: {},
      cssnano: {
        preset: 'default',
      },
    },
  },
  imports: {
    dirs: ['stores'],
  },
  build: {
    // https://vue3datepicker.com/installation/#nuxt
    transpile: ['@vuepic/vue-datepicker'],
  },
  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**'],
  },
  hooks: {
    'nitro:init': () => {
      if (process.env.ENVIRONMENT !== 'development') {
        console.log('[nitro:init]')
        console.log('[process.env] ============')
        console.log(process.env)
        console.log('==========================')
      }
    },
  },
})
