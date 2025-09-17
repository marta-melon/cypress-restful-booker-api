// bookings-crud: API tests for Restful Booker.

import { Api } from '../support/apiClient';

describe('Bookings CRUD', { tags: ['@regression', '@crud', '@critical'] }, () => {
  let token = '';
  let createdId = -1;
  let base;

  before(() => {
    const username = Cypress.env('AUTH_USER') || 'admin';
    const password = Cypress.env('AUTH_PASS') || 'password123';
    Api.auth({ username, password }).then((res) => (token = res.body.token));
    cy.fixture('data/booking-templates').then((fx) => (base = fx.base));
  });

  it('creates a booking (POST)', () => {
    cy.fixture('data/booking-templates').then((fx) => {
      const t0 = performance.now();
      Api.create(fx.base).then((res) => {
        const dt = performance.now() - t0;
        cy.recordMetric('create-booking.csv', 'POST', '/booking', dt, res.status);

        expect(res.status).to.be.oneOf([200, 201]);
        expect(res.body).to.have.property('bookingid');
        createdId = res.body.bookingid;
      });
    });
  });

  it('reads the created booking (GET)', () => {
    Api.read(createdId).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include({
        firstname: base.firstname,
        lastname: base.lastname,
        totalprice: base.totalprice,
        depositpaid: base.depositpaid,
        additionalneeds: base.additionalneeds,
      });
      expect(res.body.bookingdates).to.deep.equal(base.bookingdates);
    });
  });

  it('updates the booking (PUT)', () => {
    cy.fixture('data/booking-templates').then((fx) => {
      const t0 = performance.now();
      Api.update(createdId, fx.update, token).then((res) => {
        const dt = performance.now() - t0;
        cy.recordMetric('update-booking.csv', 'PUT', `/booking/${createdId}`, dt, res.status);

        expect(res.status).to.be.oneOf([200, 201]);
        expect(res.body).to.include({
          firstname: fx.update.firstname,
          lastname: fx.update.lastname,
          totalprice: fx.update.totalprice,
          depositpaid: fx.update.depositpaid,
          additionalneeds: fx.update.additionalneeds,
        });
        expect(res.body.bookingdates).to.deep.equal(fx.update.bookingdates);
      });
    });
  });

  it('partially updates the booking (PATCH)', () => {
    const patch = { additionalneeds: 'Dinner' };
    const t0 = performance.now();
    Api.partialUpdate(createdId, patch, token).then((res) => {
      const dt = performance.now() - t0;
      cy.recordMetric('patch-booking.csv', 'PATCH', `/booking/${createdId}`, dt, res.status);

      expect(res.status).to.be.oneOf([200, 201]);
      expect(res.body).to.have.property('additionalneeds', 'Dinner');
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

  after(() => {
    if (createdId > 0) {
      Api.remove(createdId, token);
    }
  });
});
