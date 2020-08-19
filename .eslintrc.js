module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'no-plusplus': 0,
    'consistent-return': 0,
    'default-case': 0,
    'no-console': 0,
    'global-require': 0,
    'import/no-dynamic-require': 0,
    'max-len': 0,
  },
};
