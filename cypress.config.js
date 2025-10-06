import { defineConfig } from "cypress";
import fs from "fs";
import path from "path";

export default defineConfig({
  e2e: {
    baseUrl: "https://restful-booker.herokuapp.com",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      // Map CI/process environment variables into Cypress env so tests can read them via Cypress.env("...").
      config.env = {
        ...config.env,
        AUTH_USER: process.env.AUTH_USER ?? (config.env && config.env.AUTH_USER),
        AUTH_PASS: process.env.AUTH_PASS ?? (config.env && config.env.AUTH_PASS),
      };

      // Register tasks used by tests (e.g., SLA metrics CSV appends).
      on("task", {
        metrics_appendCsv({ file, row }) {
          try {
            const projectRoot = config.projectRoot || process.cwd();
            const filePath = path.isAbsolute(file) ? file : path.join(projectRoot, file);
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.appendFileSync(filePath, String(row) + "\n", "utf8");
            return null;
          } catch (err) {
            console.error("metrics_appendCsv error:", err);
            throw err;
          }
        },
      });

      return config;
    },
  },
  env: {
    // Example SLA threshold used by sla-metrics spec. Override in CI/local as needed.
    SLA_P95_GET: 1500,
  },
  reporter: "junit",
  reporterOptions: {
    mochaFile: "results/junit-[hash].xml",
    toConsole: true,
  },
});
