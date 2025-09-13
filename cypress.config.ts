import { defineConfig } from 'cypress'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  e2e: {
    baseUrl: 'https://restful-booker.herokuapp.com',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // Rejestracja taska używanego w cy.recordMetric(...)
      on('task', {
        metrics_appendCsv(payload) {
          try {
            const file = String(payload?.file ?? '')
            const line = String(payload?.line ?? '')
            const dir = path.join(process.cwd(), 'results')
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
            const out = path.join(dir, file)
            fs.appendFileSync(out, line + '\n', 'utf8')
            return null
          } catch (e) {
            // zwróć komunikat do logów cypressa
            return (e as Error)?.message || String(e)
          }
        },
      })
      return config
    },
  },
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'results/junit-[hash].xml',
    toConsole: true,
  },
})
