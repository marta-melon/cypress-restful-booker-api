import { Api, Booking } from '../support/apiClient';

describe('Bookings CRUD', { tags: ['@regression', '@crud', '@critical'] }, () => {
  let token = '';
  let createdId = -1;
  let base: Booking;

  before(() => {
    const username = Cypress.env('AUTH_USER') || 'admin';
    const password = Cypress.env('AUTH_PASS') || 'password123';
    Api.auth({ username, password }).then((res) => (token = res.body.token));
    cy.fixture('data/booking-templates').then((fx) => (base = fx.base));
  });

  it('creates a booking (POST /booking)', () => {
    const t0 = performance.now();
    Api.create(base).then((res) => {
      const dt = performance.now() - t0;
      cy.recordMetric('post-booking.csv', 'POST', '/booking', dt, res.status);

      expect(res.status).to.eq(200);
      cy.assertSchema(res.body, 'booking-create');
      createdId = res.body.bookingid;
    });
  });

  it('reads the booking by ID (GET /booking/{id})', () => {
    const t0 = performance.now();
    Api.read(createdId).then((res) => {
      const dt = performance.now() - t0;
      cy.recordMetric('get-booking.csv', 'GET', `/booking/${createdId}`, dt, res.status);

      expect(res.status).to.eq(200);
      cy.assertSchema(res.body, 'booking');
      expect(res.body.firstname).to.eq(base.firstname);
    });
  });

  it('updates the booking (PUT)', () => {
    cy.fixture('data/booking-templates').then((fx) => {
      const t0 = performance.now();
      Api.update(createdId, fx.update, token).then((res) => {
        const dt = performance.now() - t0;
        cy.recordMetric('put-booking.csv', 'PUT', `/booking/${createdId}`, dt, res.status);

        expect(res.status).to.be.oneOf([200, 201]);
        expect(res.body.firstname).to.eq(fx.update.firstname);
      });
    });
  });

  it('partially updates the booking (PATCH)', () => {
    const patch = { additionalneeds: 'Dinner' } as Partial<Booking>;
    const t0 = performance.now();
    Api.patch(createdId, patch, token).then((res) => {
      const dt = performance.now() - t0;
      cy.recordMetric('patch-booking.csv', 'PATCH', `/booking/${createdId}`, dt, res.status);

      expect(res.status).to.be.oneOf([200, 201]);
      expect(res.body.additionalneeds).to.eq('Dinner');
    });
  });

  it('deletes the booking (DELETE)', () => {
    const t0 = performance.now();
    Api.remove(createdId, token).then((res) => {
      const dt = performance.now() - t0;
      cy.recordMetric('delete-booking.csv', 'DELETE', `/booking/${createdId}`, dt, res.status);

      expect(res.status).to.be.oneOf([200, 201, 204]);
    });
  });
});
