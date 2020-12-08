module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    // 'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    "no-unused-labels": "off",
    "camelcase": "off",
    "no-console": "off",
    "no-new": "off",
    "require-await": "off",
    "vue/attributes-order": "off",
    "vue/order-in-components": "off",
    "eqeqeq": "off",
    "dot-notation": "off",
    "object-shorthand": 'off'
  },
}
