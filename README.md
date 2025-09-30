# Cypress API – Restful Booker

Lean Cypress project to validate **Restful Booker** API end‑to‑end: authentication, booking CRUD (positive/negative), contracts and operational probes.

## Highlights
- **Auth** token flow and protected endpoints.
- **CRUD** for `/booking` with thorough negative matrix.
- **JSON contracts** via AJV.
- **SLA probe** (p95) for `GET /booking` across multiple samples.
- **Security sanity** (headers, content type).

## Structure
```
cypress/
  e2e/                  # auth, bookings-crud, negative, security, sla
  fixtures/             # payload templates
  support/              # api client & helpers
cypress.config.js
package.json
```

## Run
```bash
npm ci
npm test
```

### Base URL
Defaults to `https://restful-booker.herokuapp.com`. Override:
```bash
BOOKER_BASE_URL=http://localhost:3001 npm test
```

## Outputs
- Cypress results with request/response logs.
- Optional JUnit/JSON reports for CI.

## What these tests cover
Confidence that core API contracts and behaviors remain stable, and that regressions in performance or basic security are detected quickly.
