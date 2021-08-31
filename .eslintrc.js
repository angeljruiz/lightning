module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'consistent-return': 'off',
    'no-restricted-globals': 'off',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'no-loop-func': 'off',
  },
};
