import { defineConfig } from "cypress";
import fs from "fs";
import path from "path";

export default defineConfig({
  e2e: {
    baseUrl: "https://restful-booker.herokuapp.com",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      on("task", {
        metrics_appendCsv(payload) {
          try {
            const file = String(
              payload && payload.file ? payload.file : "metrics.csv",
            );
            const line = String(payload && payload.line ? payload.line : "");
            const dir = path.join(process.cwd(), "results");
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.appendFileSync(
              path.join(dir, file),
              line.endsWith("\n") ? line : line + "\n",
              "utf8",
            );
            return null;
          } catch (e) {
            console.error("metrics_appendCsv failed", e);
            return null;
          }
        },
      });
      return config;
    },
    env: {
      SLA_P95_GET: 1500,
    },
  },
  reporter: "junit",
  reporterOptions: {
    mochaFile: "results/junit-[hash].xml",
    toConsole: true,
  },
});
