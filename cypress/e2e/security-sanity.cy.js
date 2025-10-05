// Security sanity tests with raw cy.request.
// Some backends return 404 for unauthorized to avoid disclosing resource existence.
const BASE = Cypress.env("BASE_URL");
const NON_EXISTENT_ID = 99999999; // adjust to your API

describe("Security sanity — missing cases", () => {
  it("PUT without token -> 401/403/404", () => {
    cy.request({
      method: "PUT",
      url: `${BASE}/booking/${NON_EXISTENT_ID}`,
      body: { foo: "bar" },
      failOnStatusCode: false,
    }).then((res) => {
      expect([401, 403, 404]).to.include(res.status);
    });
  });

  it("PATCH without token -> 401/403/404", () => {
    cy.request({
      method: "PATCH",
      url: `${BASE}/booking/${NON_EXISTENT_ID}`,
      body: { foo: "bar" },
      failOnStatusCode: false,
    }).then((res) => {
      expect([401, 403, 404]).to.include(res.status);
    });
  });

  it("DELETE without token -> 401/403/404", () => {
    cy.request({
      method: "DELETE",
      url: `${BASE}/booking/${NON_EXISTENT_ID}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect([401, 403, 404]).to.include(res.status);
    });
  });

  it("Random token must not authorize -> 401/403/404", () => {
    const bogus = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Date.now()}.sig`;
    cy.request({
      method: "DELETE",
      url: `${BASE}/booking/${NON_EXISTENT_ID}`,
      headers: { Authorization: `Bearer ${bogus}` },
      failOnStatusCode: false,
    }).then((res) => {
      expect([401, 403, 404]).to.include(res.status);
    });
  });

  it("Create without token (adjust to API) -> 200/201/400/404/405", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/booking`,
      body: { invalid: "payload" },
      failOnStatusCode: false,
    }).then((res) => {
      expect([200, 201, 400, 404, 405]).to.include(res.status);
    });
  });

  it.skip("RBAC: regular user cannot access admin endpoint -> 403", () => {
    cy.request({
      method: "GET",
      url: `${BASE}/admin/stats`,
      headers: { Authorization: "Bearer REPLACE_WITH_VALID_USER_TOKEN" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(403);
    });
  });

  it.skip("Expired token -> 401", () => {
    const expired = "REPLACE_WITH_EXPIRED_TOKEN";
    cy.request({
      method: "DELETE",
      url: `${BASE}/booking/${NON_EXISTENT_ID}`,
      headers: { Authorization: `Bearer ${expired}` },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401);
    });
  });
});
