import { defineConfig } from 'cypress'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  e2e: {
    baseUrl: 'https://restful-booker.herokuapp.com',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // cy.task('metrics_appendCsv', { file, line })
      on('task', {
        metrics_appendCsv({ file, line }: { file: string; line: string }) {
          const dir = path.join(process.cwd(), 'results')
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
          const out = path.join(dir, file)
          fs.appendFileSync(out, line + '\n', 'utf8')
          return null
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