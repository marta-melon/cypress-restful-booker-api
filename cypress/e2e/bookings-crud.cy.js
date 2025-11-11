// bookings-crud: API tests for Restful Booker.
// IMPORTANT: These tests assume Cypress config has baseUrl set to the API host.
// Auth in Restful Booker returns { token } that must be sent via Cookie header on protected ops.

import { Api } from "../support/apiClient";

describe(
  "Bookings CRUD",
  { tags: ["@regression", "@crud", "@critical"] },
  () => {
    let token = "";
    let createdId = -1;
    let baseTemplate;

    before(() => {
      Api.getToken().then( (result) => {
        token = result
      });

      cy.fixture("data/booking-templates").then(
        (fx) => (baseTemplate = fx.base),
      );
    });

    it("creates a booking (POST)", () => {
      cy.fixture("data/booking-templates").then((fx) => {
        const t0 = performance.now();
        Api.create(fx.base).then((res) => {
          const dt = performance.now() - t0;
          cy.recordMetric(
            "create-booking.csv",
            "POST",
            "/booking",
            dt,
            res.status,
          );

          expect(res.status).to.be.oneOf([200, 201]);
          expect(res.body, "create body").to.have.property("bookingid");

          cy.assertSchema( res.body, "bookingCreate" );

          createdId = res.body.bookingid;
          expect(createdId, "createdId").to.be.a("number").and.greaterThan(0);
        });
      });
    });

    it("reads the created booking (GET)", () => {
      // Ensure we really have an id from the previous test
      expect(createdId, "createdId should be set by POST test")
        .to.be.a("number")
        .and.greaterThan(0);

      Api.read(createdId).then((res) => {
        // Validate status first to avoid reading undefined properties
        expect(res.status, "GET /booking/:id status").to.eq(200);
        expect(res.body, "GET /booking/:id body").to.be.an("object");

        cy.assertSchema( res.body, "booking" );

        // Compare with template we used for creation
        expect(res.body).to.include({
          firstname: baseTemplate.firstname,
          lastname: baseTemplate.lastname,
          totalprice: baseTemplate.totalprice,
          depositpaid: baseTemplate.depositpaid,
          additionalneeds: baseTemplate.additionalneeds,
        });
        expect(res.body.bookingdates).to.deep.equal(baseTemplate.bookingdates);
      });
    });

    it("updates the booking (PUT)", () => {
      cy.fixture("data/booking-templates").then((fx) => {
        const t0 = performance.now();
        Api.update(createdId, fx.update, token).then((res) => {
          const dt = performance.now() - t0;
          cy.recordMetric(
            "update-booking.csv",
            "PUT",
            `/booking/${createdId}`,
            dt,
            res.status,
          );


          expect(res.status).to.be.oneOf([200, 201]);

          cy.assertSchema( res.body, "booking" );

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

    it("partially updates the booking (PATCH)", () => {
      const patch = { additionalneeds: "Dinner" };
      const t0 = performance.now();
      Api.patch( createdId, patch, token ).then((res) => {
        const dt = performance.now() - t0;
        cy.recordMetric(
          "patch-booking.csv",
          "PATCH",
          `/booking/${createdId}`,
          dt,
          res.status,
        );

        expect(res.status).to.be.oneOf([200, 201]);
        expect(res.body).to.have.property("additionalneeds", "Dinner");
      });
    });

    it("deletes the booking (DELETE)", () => {
      const t0 = performance.now();
      Api.remove(createdId, token).then((res) => {
        const dt = performance.now() - t0;
        cy.recordMetric(
          "delete-booking.csv",
          "DELETE",
          `/booking/${createdId}`,
          dt,
          res.status,
        );
        expect(res.status).to.be.oneOf([200, 201, 204]);
      });
    });

    after(() => {
      // Best-effort cleanup if DELETE test was skipped or failed mid-suite
      if (createdId && createdId > 0) {
        Api.remove(createdId, token);
      }
    });
  },
);
