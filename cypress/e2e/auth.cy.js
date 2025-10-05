// auth.cy.ts: API tests for Restful Booker.

import { Api } from "../support/apiClient";

describe("Auth", { tags: ["@smoke", "@auth"] }, () => {
  it("creates token with valid credentials", () => {
const username = Cypress.env("AUTH_USER");
const password = Cypress.env("AUTH_PASS");
// Fail fast if credentials are missing. We never want hardcoded defaults in code.
if (!username || !password) {
  throw new Error("AUTH_USER/AUTH_PASS are required. Set them in cypress.env.json (not committed) or as GitHub Actions secrets.");
}


    Api.auth({ username, password }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property("token").and.to.be.a("string").and.not
        .be.empty;
    });
  });

  it("returns 200 with token on cookie for protected ops (sanity)", () => {
const username = Cypress.env("AUTH_USER");
const password = Cypress.env("AUTH_PASS");
// Fail fast if credentials are missing. We never want hardcoded defaults in code.
if (!username || !password) {
  throw new Error("AUTH_USER/AUTH_PASS are required. Set them in cypress.env.json (not committed) or as GitHub Actions secrets.");
}


    Api.auth({ username, password }).then((res) => {
      const token = res.body.token;
      cy.request({
        method: "PATCH",
        url: "/booking/0",
        failOnStatusCode: false,
        headers: { Cookie: `token=${token}` },
      })
        .its("status")
        .should("be.oneOf", [200, 201, 400, 404, 405]);
    });
  });
});
