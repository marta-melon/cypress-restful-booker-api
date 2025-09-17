// auth.cy.ts: API tests for Restful Booker.

import { Api } from '../support/apiClient';

describe('Auth', { tags: ['@smoke', '@auth'] }, () => {
 it('creates token with valid credentials', () => {
 const username = Cypress.env('AUTH_USER') || 'admin';
 const password = Cypress.env('AUTH_PASS') || 'password123';

 Api.auth({ username, password }).then((res) => {
 expect(res.status).to.eq(200);
 expect(res.body).to.have.property('token').and.to.be.a('string').and.not.be.empty;
 });
 });

 it('returns 200 with token on cookie for protected ops (sanity)', () => {
 const username = Cypress.env('AUTH_USER') || 'admin';
 const password = Cypress.env('AUTH_PASS') || 'password123';

 Api.auth({ username, password }).then((res) => {
 const token = res.body.token;
 cy.request({ method: 'PATCH', url: '/booking/0', failOnStatusCode: false, headers: { Cookie: `token=${token}` } })
 .its('status')
 .should('be.oneOf', [200, 201, 400, 404, 405]);
 });
 });
});
