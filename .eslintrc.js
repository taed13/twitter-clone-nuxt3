module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['@nuxtjs/eslint-config-typescript', 'plugin:vue/vue3-recommended', 'plugin:nuxt/recommended', 'prettier'],
  plugins: ['vitest'],
  rules: {
    'no-undefined': 'error',
    camelcase: 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-unused-vars': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'require-await': 'warn',
  },
}
