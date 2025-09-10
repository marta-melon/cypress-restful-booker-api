// / <reference types="cypress" />
import { validateSchema } from './schema';
import bookingSchema from '../schemas/booking.json';
import bookingCreateSchema from '../schemas/booking-create.json';

Cypress.Commands.add('assertSchema', (data: unknown, schemaName: 'booking' | 'booking-create') => {
  const map = { booking: bookingSchema as object, 'booking-create': bookingCreateSchema as object } as const;
  validateSchema(data, map[schemaName]);
});

Cypress.Commands.add('recordMetric', (file: string, method: string, path: string, ms: number, status: number) => {
  const line = `${new Date().toISOString()},${method},${path},${ms},${status}`;
  cy.task('metrics_appendCsv', { file, line });
});

declare global {
  namespace Cypress {
    interface Chainable {
      assertSchema(data: unknown, schemaName: 'booking' | 'booking-create'): Chainable<void>;
      recordMetric(file: string, method: string, path: string, ms: number, status: number): Chainable<void>;
    }
  }
}
