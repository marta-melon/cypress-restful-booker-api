# Cypress Restful Booker API — E2E tests

## Project structure (high-level)
```
cypress/
  e2e/                  # auth, bookings-crud, negative, security, sla
  fixtures/             # payload templates
  schemas/              # JSON Schemas (optional validation)
  support/              # api client & helpers
cypress.config.js
package.json
```
> Note: the repo may contain additional dotfiles (linters, editor settings, CI workflows).

## Running locally
### 1) Provide credentials (do **not** commit these)
Either via env…
```bash
# bash
export AUTH_USER=admin AUTH_PASS=password123
npx cypress run
```
…or via CLI flag…
```bash
npx cypress run --env AUTH_USER=admin,AUTH_PASS=password123
```
…or create `cypress.env.json` (gitignored):
```json
{ "AUTH_USER": "admin", "AUTH_PASS": "password123" }
```

### 2) Full headless run
```bash
npm test
# or
npx cypress run --headless --browser electron --spec "cypress/e2e/**/*.cy.js"
```

## CI — GitHub Actions
Add repository **Secrets** (Settings → Security → Secrets and variables → Actions → Secrets):
- `CYPRESS_USERNAME` → e.g. `admin`
- `CYPRESS_PASSWORD` → e.g. `password123`

Workflows map them to `AUTH_USER`/`AUTH_PASS` env, and `cypress.config.js` exposes them as `Cypress.env(...)` for tests.

For PRs from forks, GitHub does **not** expose secrets — the workflow falls back to a subset of specs that do not require auth.

## Scripts
- `npm test` — headless run (Electron)
- `npm run test:gui` — open Cypress runner
- `npm run format` — Prettier write (optional)

## Reports & metrics
- JUnit XML goes to `results/`
- SLA test uses `cy.task("metrics_appendCsv")` to append CSV rows; destination file lives under repo root (task creates folders).

## Notes
- Protected operations (PUT/PATCH/DELETE on `/booking/:id`) require `Cookie: token=<value>` header; token is returned by `POST /auth`.
- No hard-coded credentials in sources — use env/Secrets only.
