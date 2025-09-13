import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'https://restful-booker.herokuapp.com',
    setupNodeEvents(on, config) {
      // Możesz tu dodać własne eventy, np. logowanie, pluginy itp.
      return config
    },
  },
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'results/junit-[hash].xml',
    toConsole: true,
  },
})