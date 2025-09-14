import { defineConfig } from 'cypress'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  e2e: {
    baseUrl: 'https://restful-booker.herokuapp.com',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      on('task', {
        metrics_appendCsv(payload) {
          try {
            const file = String(payload && payload.file ? payload.file : 'metrics.csv')
            const line = String(payload && payload.line ? payload.line : '')
            const dir = path.join(process.cwd(), 'results')
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true })
            }
            const out = path.join(dir, file)
            fs.appendFileSync(out, line + '\n', 'utf8')
            return null
          } catch (e) {
            return String(e && e.message ? e.message : e)
          }
        },
      })
      return config
    },
    env: {
      SLA_P95_GET: 1500
    }
  },
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'results/junit-[hash].xml',
    toConsole: true,
  },
})
