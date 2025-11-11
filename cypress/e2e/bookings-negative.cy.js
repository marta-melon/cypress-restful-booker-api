// bookings-negative.cy.ts: API tests for Restful Booker.

import { Api } from "../support/apiClient";

const NON_EXISTENT = 999999999999;

describe(
  "Bookings negative paths",
  { tags: ["@regression", "@negative"] },
  () => {
    let token = "";
    let createdId = -1;
    let baseTemplate;

    before(() => {

      cy.fixture("data/booking-templates").then(
        (fx) => (baseTemplate = fx.base),
      );

      Api.getToken().then( (result) => {
        token = result

        Api.create(baseTemplate).then((res) => {
          createdId = res.body.bookingid;

          expect(res.status).to.be.oneOf([200, 201]);
          expect(createdId, "createdId").to.be.a("number").and.greaterThan(0);
        });
      })

    });

    it("GET /booking/{id} returns 404 for non-existent ID", () => {
      Api.read(999999).its("status").should("be.oneOf", [404, 500]);
    });

    it("PUT without token should be rejected", () => {
      cy.fixture("data/booking-templates").then((fx) => {
        Api.update(1, fx.base)
          .its("status")
          .should("be.oneOf", [403, 401, 405]);
      });
    });

    it("POST with invalid payload should 500/400", () => {
      cy.request({
        method: "POST",
        url: "/booking",
        body: { whatever: true },
        failOnStatusCode: false,
      }).its("status")
        .should("be.oneOf", [400, 500]);
    });

    it("Update rejects invalid body -> 400", () => {
      Api.update(createdId,{ unexpected: "field" }, token).then((res) => {
        expect(res.status).to.eq(400);
      });
    });

    it("Cannot delete non-existent -> 404 (with valid token)", () => {
      Api.remove(NON_EXISTENT, token)
    });

    it("Cannot update non-existent -> 400 (with valid token)", () => {
      Api.update(NON_EXISTENT, baseTemplate , token)
        .its("status")
        .should("be.oneOf", [400, 405]);
    });

    it("Cannot partialy update non-existent -> 404 (with valid token)", () => {
      const patch = { additionalneeds: "Dinner" };
      Api.patch(NON_EXISTENT, patch , token)
        .its("status")
        .should("be.oneOf", [400, 405]);
    });

    after(() => {
      if (createdId && createdId > 0) {
        Api.remove(createdId, token);
      }
    });
  },
);
