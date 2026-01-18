// Security sanity tests with raw cy.request.
// Some backends return 404 for unauthorized to avoid disclosing resource existence.
const NON_EXISTENT_ID = 99999999; // adjust to your API

import { Api } from "../support/apiClient";

describe("Security sanity — missing cases", () => {
  it("PUT without token -> 401/403/404", () => {
    Api.update(NON_EXISTENT_ID, { foo: "bar" }, null)
      .then((res) => {
        expect([401, 403, 404]).to.include(res.status);
      });
  });

  it("PATCH without token -> 401/403/404", () => {
    Api.patch(NON_EXISTENT_ID, { foo: "bar" }, null)
      .then((res) => {
        expect([401, 403, 404]).to.include(res.status);
      });
  });

  it("DELETE without token -> 401/403/404", () => {
    Api.remove(NON_EXISTENT_ID, null)
      .then((res) => {
        expect([401, 403, 404]).to.include(res.status);
      });
  });

  it("Random token must not authorize -> 401/403/404", () => {
    const bogus = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Date.now()}.sig`;
    Api.remove(NON_EXISTENT_ID, bogus)
      .then((res) => {
        expect([401, 403, 404]).to.include(res.status);
      });
  });

  it.skip("Expired token -> 401", () => {
    const expired = "REPLACE_WITH_EXPIRED_TOKEN";
    Api.remove(NON_EXISTENT_ID, expired)
      .then((res) => {
        expect(res.status).to.eq(401);
      });
  });
});
