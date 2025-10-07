// Auth specs: validate token creation and that a protected operation succeeds with token.
// Comments in English (per review).

import { Api } from "../support/apiClient";

describe("Auth", () => {
  let token = "";

  before(() => {
    const username = Cypress.env("AUTH_USER");
    const password = Cypress.env("AUTH_PASS");
    if (!username || !password) {
      throw new Error(
        "AUTH_USER/AUTH_PASS are required. Set them in cypress.env.json (not committed) or as GitHub Actions secrets.",
      );
    }

    // Authenticate and cache token
    return Api.auth({ username, password }).then((res) => {
      expect(res.status, "auth status").to.be.oneOf([200, 201]);
      expect(res.body && res.body.token, "auth token").to.be.a("string").and.not
        .be.empty;
      token = res.body.token;
    });
  });

  it("creates token with valid credentials", () => {
    // Nothing to do here: token was created in before() and validated with assertions.
    // This test exists to keep the original test count and intent explicit.
    expect(token, "token from before()").to.be.a("string").and.not.be.empty;
  });

  it("returns 200/201/204 on a protected DELETE when token cookie is set (sanity)", () => {
    // Create a temporary booking, then delete it using the token cookie.
    // This exercises an actually protected operation instead of an endpoint that may return 405.
    return Api.create({
      firstname: "Temp",
      lastname: "User",
      totalprice: 123,
      depositpaid: true,
      bookingdates: { checkin: "2023-01-01", checkout: "2023-01-02" },
      additionalneeds: "Breakfast",
    }).then((createRes) => {
      expect(createRes.status, "create status").to.be.oneOf([200, 201]);
      const id = createRes.body && createRes.body.bookingid;
      expect(id, "created booking id").to.be.a("number");

      // Use client delete helper if present, else fall back to direct request.
      if (Api.remove) {
        return Api.remove(id, token).then((delRes) => {
          expect(delRes.status, "delete status").to.be.oneOf([200, 201, 204]);
        });
      }

      return cy
        .request({
          method: "DELETE",
          url: `/booking/${id}`,
          headers: {
            Accept: "application/json",
            Cookie: `token=${token}`,
          },
          failOnStatusCode: false,
        })
        .then((delRes) => {
          expect(delRes.status, "delete status").to.be.oneOf([200, 201, 204]);
        });
    });
  });
});
