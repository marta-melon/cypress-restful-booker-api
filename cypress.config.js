import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://restful-booker.herokuapp.com",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      // Map CI/process environment variables into Cypress env, so tests can read via Cypress.env("...")
      config.env = {
        ...config.env,
        AUTH_USER: process.env.AUTH_USER || (config.env && config.env.AUTH_USER),
        AUTH_PASS: process.env.AUTH_PASS || (config.env && config.env.AUTH_PASS),
      };
      return config;
    },
  },
  env: {
    // You may override these via cypress.env.json (local) or CI secrets (mapped above).
    SLA_P95_GET: 1500,
  },
  reporter: "junit",
  reporterOptions: {
    mochaFile: "results/junit-[hash].xml",
    toConsole: true,
  },
});
