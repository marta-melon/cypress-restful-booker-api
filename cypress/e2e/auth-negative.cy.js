// Negative auth tests using raw cy.request.
// NOTE: Use relative URLs so Cypress baseUrl applies. Do not rely on a custom BASE env.
// Some APIs return 404 to avoid user enumeration; include 404 in expectations.

describe("Auth — negative cases", () => {
  it("Wrong password -> should NOT return a valid token", () => {
    cy.request({
      method: "POST",
      url: `/auth`,
      body: { username: "admin", password: "totally-wrong" },
      failOnStatusCode: false,
    }).then((res) => {
      // Accept 200 (error payload), 401/403 (auth error), or 404 (masking).
      expect([200, 401, 403, 404]).to.include(res.status);
      const token = res.body && (res.body.token || res.body.access_token);
      expect(token, "no token should be issued").to.not.be.a("string");
    });
  });

  it("Wrong username -> should NOT return a valid token", () => {
    cy.request({
      method: "POST",
      url: `/auth`,
      body: { username: "no-such-user", password: "whatever" },
      failOnStatusCode: false,
    }).then((res) => {
      expect([200, 401, 403, 404]).to.include(res.status);
      const token = res.body && (res.body.token || res.body.access_token);
      expect(token, "no token should be issued").to.not.be.a("string");
    });
  });
});
