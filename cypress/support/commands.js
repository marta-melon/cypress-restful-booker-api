import { validateSchema } from './schema'
import bookingSchema from '../schemas/booking.json'
import bookingCreateSchema from '../schemas/booking-create.json'

Cypress.Commands.add('assertSchema', (data: unknown, schemaName: 'booking' | 'booking-create') => {
  const schema = schemaName === 'booking' ? bookingSchema : bookingCreateSchema
  validateSchema(data, schema)
})

Cypress.Commands.add('recordMetric', (file: string, method: string, route: string, ms: number, status: number) => {
  const line = [method, route, String(ms), String(status)].join(',')
  cy.task('metrics_appendCsv', { file, line })
})
