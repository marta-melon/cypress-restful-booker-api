# Cypress API – Restful Booker

Lean Cypress project validating **Restful Booker** API end-to-end: authentication, booking CRUD (positive & negative), schema contracts, SLA probes and basic security checks.

## Highlights

- **Auth** token flow and protected endpoints  
- **CRUD** coverage for `/booking` with negative matrix  
- **AJV**-based **JSON schema** validation  
- **SLA probe** (`p95`) for `GET /booking` across samples  
- **Security sanity** (headers, content type)  


## Structure

```
cypress/
  e2e/                  # auth, bookings-crud, negative, security, sla
  fixtures/             # payload templates
  schemas/              # JSON schemas for contract tests
  support/              # api client & helpers
cypress.config.js       # Cypress config (ESM, JS-only)
package.json
```

## Run

```bash
npm ci
npm run lint
npm run format
npm test
```

### Base URL

Defaults to `https://restful-booker.herokuapp.com`.  
Override if needed:

```bash
BOOKER_BASE_URL=http://localhost:3001 npm test
```

## Metrics

Performance metrics and SLA samples are written as CSV lines into `results/`.

Example usage inside tests:

```js
cy.task('metrics_appendCsv', { line: `GET,/booking,${p95}` })
```

Optionally specify a custom file:

```js
cy.task('metrics_appendCsv', { file: 'sla.csv', line: `GET,/booking,${p95}` })
```

If `file` is omitted, output defaults to `results/metrics.csv`.

## Outputs

- Cypress request/response logs  
- Optional JUnit/JSON reports for CI pipelines  
- CSV performance metrics under `results/`  

## What these tests ensure

Confidence that core **API contracts**, **business rules**, and **performance SLAs** remain stable — catching regressions early in both functionality and response times.
