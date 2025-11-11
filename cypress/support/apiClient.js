// Lightweight API client used by tests.

export const Api = {
  auth({ username, password }) {
    return cy.request({
      method: "POST",
      url: "/auth",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: { username, password },
      failOnStatusCode: false,
    });
  },

  listIds() {
    return cy.request({
      method: "GET",
      url: "/booking",
      headers: { Accept: "application/json" },
      failOnStatusCode: false,
    });
  },

  read(id) {
    return cy.request({
      method: "GET",
      url: `/booking/${id}`,
      headers: { Accept: "application/json" },
      failOnStatusCode: false,
    });
  },

  create(body) {
    return cy.request({
      method: "POST",
      url: "/booking",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
      failOnStatusCode: false,
    });
  },

  update(id, body, token) {
    return cy.request({
      method: "PUT",
      url: `/booking/${id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Restful Booker accepts auth via Cookie token on protected ops
        ...(token ? { Cookie: `token=${token}` } : {}),
      },
      body,
      failOnStatusCode: false,
    });
  },

  patch(id, body, token) {
    return cy.request({
      method: "PATCH",
      url: `/booking/${id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Cookie: `token=${token}` } : {}),
      },
      body,
      failOnStatusCode: false,
    });
  },

  remove(id, token) {
    return cy.request({
      method: "DELETE",
      url: `/booking/${id}`,
      headers: {
        Accept: "application/json",
        ...(token ? { Cookie: `token=${token}` } : {}),
      },
      failOnStatusCode: false,
    });
  },

  getToken() {
      // Read credentials strictly from env. Never keep fallbacks in code.
      const username = Cypress.env("AUTH_USER");
      const password = Cypress.env("AUTH_PASS");

      // Fail fast if credentials are missing.
      if (!username || !password) {
        throw new Error(
          "AUTH_USER/AUTH_PASS are required. Set them in cypress.env.json (not committed) or as GitHub Actions secrets.",
        );
      }

      // Authenticate and cache token
      return Api.auth({username, password})
      .then((res) => {
        expect(res.status, "auth status").to.be.oneOf([200, 201]);
        expect(res.body && res.body.token, "auth token").to.be.a("string").and.not.be.empty;
        const token = res.body.token;
        return token;
      });
  }
};
