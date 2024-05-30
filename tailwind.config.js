import themeConfigJson from './tailwind/theme.config.json'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{vue,js,ts}',
    './src/layouts/**/*.{vue,js,ts}',
    './src/pages/**/*.{vue,js,ts}',
    './src/error.vue',
  ],
  darkMode: 'class',
  theme: {
    extend: themeConfigJson,
  },
  plugins: [require('@tailwindcss/forms')],
}
