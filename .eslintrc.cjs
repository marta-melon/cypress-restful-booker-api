module.exports = {
  root: true,
  env: { node: true, es2022: true },
  extends: ["eslint:recommended", "plugin:cypress/recommended", "prettier"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  rules: {
    "cypress/no-unnecessary-waiting": "error",
    "no-console": ["warn", { allow: ["warn", "error"] }]
  },
  overrides: [
    { files: ["cypress/**/*.ts"], parserOptions: { project: ["./tsconfig.json"] } }
  ]
};
