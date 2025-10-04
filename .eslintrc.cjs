/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: ["eslint:recommended", "plugin:cypress/recommended"],
  plugins: ["cypress"],
  overrides: [
    {
      files: ["cypress/**/*.cy.js", "cypress/support/**/*.js"],
      env: { mocha: true },
      rules: {
        // Chai: expect(x).to.be.true
        "no-unused-expressions": "off",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {},
};
