// Lightweight API client used by tests. Comments in English.

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

  // NEW: partial update helper (PATCH) — previously missing in the wrapper.
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
};
