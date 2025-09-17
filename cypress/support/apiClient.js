export const Api = {
  auth({ username, password }) {
    return cy.request({
      method: 'POST',
      url: '/auth',
      body: { username, password },
      failOnStatusCode: false,
    })
  },

  listIds(query = {}) {
    return cy.request({
      method: 'GET',
      url: '/booking',
      qs: query,
      failOnStatusCode: false,
    })
  },

  read(id) {
    return cy.request({
      method: 'GET',
      url: `/booking/${id}`,
      failOnStatusCode: false,
    })
  },

  create(booking) {
    return cy.request({
      method: 'POST',
      url: '/booking',
      body: booking,
      failOnStatusCode: false,
    })
  },

  update(id, booking, token) {
    return cy.request({
      method: 'PUT',
      url: `/booking/${id}`,
      body: booking,
      headers: token ? { Cookie: `token=${token}` } : undefined,
      failOnStatusCode: false,
    })
  },

  partialUpdate(id, patch, token) {
    return cy.request({
      method: 'PATCH',
      url: `/booking/${id}`,
      body: patch,
      headers: token ? { Cookie: `token=${token}` } : undefined,
      failOnStatusCode: false,
    })
  },

  remove(id, token) {
    return cy.request({
      method: 'DELETE',
      url: `/booking/${id}`,
      headers: token ? { Cookie: `token=${token}` } : undefined,
      failOnStatusCode: false,
    })
  },
}
