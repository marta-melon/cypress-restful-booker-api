// / <reference types="cypress" />

type Creds = { username: string; password: string };

type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
};

type BookingCreateResp = { bookingid: number; booking: Booking };

export const Api = {
  auth(creds: Creds) {
    return cy.request<{ token: string }>({
      method: 'POST',
      url: '/auth',
      body: creds,
      failOnStatusCode: false
    });
  },
  listIds(query?: Partial<Booking>) {
    return cy.request<{ bookingid: number }[]>({ method: 'GET', url: '/booking', qs: query });
  },
  create(booking: Booking) {
    return cy.request<BookingCreateResp>({ method: 'POST', url: '/booking', body: booking });
  },
  read(id: number) {
    return cy.request<Booking>({ method: 'GET', url: `/booking/${id}` });
  },
  update(id: number, booking: Booking, token?: string) {
    return cy.request<Booking>({
      method: 'PUT',
      url: `/booking/${id}`,
      body: booking,
      headers: token ? { Cookie: `token=${token}` } : undefined,
      failOnStatusCode: false
    });
  },
  patch(id: number, patch: Partial<Booking>, token?: string) {
    return cy.request<Booking>({
      method: 'PATCH',
      url: `/booking/${id}`,
      body: patch,
      headers: token ? { Cookie: `token=${token}` } : undefined,
      failOnStatusCode: false
    });
  },
  remove(id: number, token?: string) {
    return cy.request({
      method: 'DELETE',
      url: `/booking/${id}`,
      headers: token ? { Cookie: `token=${token}` } : undefined,
      failOnStatusCode: false
    });
  }
};

export type { Booking };
