import { defineConfig } from "cypress";
import fs from "fs";
import path from "path";

export default defineConfig({
  e2e: {
    baseUrl: "https://restful-booker.herokuapp.com",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      // Map CI/process env -> Cypress.env so tests can read via Cypress.env("AUTH_USER"/"AUTH_PASS")
      config.env = {
        ...config.env,
        AUTH_USER:
          process.env.AUTH_USER ?? (config.env && config.env.AUTH_USER),
        AUTH_PASS:
          process.env.AUTH_PASS ?? (config.env && config.env.AUTH_PASS),
      };

      // Task used by SLA test to append CSV rows
      on("task", {
        metrics_appendCsv({ file, row }) {
          const projectRoot = config.projectRoot || process.cwd();
          const filePath = path.isAbsolute(file)
            ? file
            : path.join(projectRoot, "results/csv/", file);
          fs.mkdirSync(path.dirname(filePath), { recursive: true });
          fs.appendFileSync(filePath, String(row) + "\n", "utf8");
          return null;
        },
      });

      return config;
    },
  },
  env: {
    // Example SLA threshold; override via cypress env if desired.
    SLA_P95_GET: 1500,
  },
  reporter: "junit",
  reporterOptions: {
    mochaFile: "results/junit-[hash].xml",
    toConsole: true,
  },
});
