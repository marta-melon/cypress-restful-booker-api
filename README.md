# Cypress Restful Booker API Tests

This project tests the public API **restful-booker.herokuapp.com** with Cypress 13 and JavaScript.

## Tests
- `auth.cy.ts` – token and cookie flow
- `bookings-crud.cy.ts` – create, read, update, patch, delete
- `bookings-negative.cy.ts` – 404 and bad requests
- `security-sanity.cy.ts` – headers and JSON
- `sla-metrics.cy.ts` – p95 for GET /booking

## Install
```bash
npm ci
npx cypress verify
```

## Run
GUI:
```bash
npm run test:gui
```
Headless:
```bash
npm test
```

## CI
GitHub Actions runs tests on Ubuntu. It uses matrix (Electron + Chrome) and shards.

Flow:
```
push -> matrix -> shard -> run -> artifacts
```

CSV metrics are saved to `results/`. Schemas are validated with AJV.
