import 'cypress-grep';

Cypress.on('uncaught:exception', () => false);

beforeEach(() => {
  cy.viewport(1280, 800);
});
