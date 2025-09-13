// .eslintrc.cjs
module.exports = {
  root: true,
  env: { node: true, es2022: true, 'cypress/globals': true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['@typescript-eslint', 'cypress'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:cypress/recommended',
    'prettier',
  ],
  ignorePatterns: ['node_modules/', 'dist/', 'build/', 'results/', 'cypress/videos/', 'cypress/screenshots/'],
};
