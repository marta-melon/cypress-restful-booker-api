import { defineConfig } from 'cypress';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  e2e: {
    baseUrl: 'https://restful-booker.herokuapp.com',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    video: true,
    retries: { runMode: 2, openMode: 0 },
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 60000,
    env: {
      SLA_P95_GET: 800,
      SLA_P95_POST: 1000,
      SLA_P95_PUT: 1200,
      SLA_P95_PATCH: 1000,
      SLA_P95_DELETE: 1000
    },
    setupNodeEvents(on, config) {
      on('task', {
        metrics_writeCsv({ file, rows }: { file: string; rows: string[] }) {
          const dest = path.join('results/metrics', file);
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.writeFileSync(dest, rows.join('\n') + '\n', 'utf8');
          return null;
        },
        metrics_appendCsv({ file, line }: { file: string; line: string }) {
          const dest = path.join('results/metrics', file);
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.appendFileSync(dest, line + '\n', 'utf8');
          return null;
        }
      });
      return config;
    }
  },
  reporter: 'junit',
  reporterOptions: { mochaFile: 'results/junit-[hash].xml', toConsole: true }
});
