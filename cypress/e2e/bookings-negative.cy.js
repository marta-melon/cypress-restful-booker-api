// bookings-negative.cy.ts: API tests for Restful Booker.

import { Api } from '../support/apiClient';

describe('Bookings negative paths', { tags: ['@regression', '@negative'] }, () => {
 it('GET /booking/{id} returns 404 for non-existent ID', () => {
 Api.read(999999).its('status').should('be.oneOf', [404, 500]);
 });

 it('PUT without token should be rejected', () => {
 cy.fixture('data/booking-templates').then((fx) => {
 Api.update(1, fx.base).its('status').should('be.oneOf', [403, 401, 405]);
 });
 });

 it('POST with invalid payload should 500/400', () => {
 cy.request({ method: 'POST', url: '/booking', body: { whatever: true }, failOnStatusCode: false })
 .its('status')
 .should('be.oneOf', [400, 500]);
 });
});
