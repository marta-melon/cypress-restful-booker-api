# Test Plan – Restful Booker (Cypress API)

## Objective

Validate availability, correctness and resilience of the Restful Booker API with emphasis on `/auth` and `/booking` resources.

## Scope

**Positive**

- `POST /auth` issues a token; token authorizes protected operations.
- `POST /booking` creates a booking; `GET /booking/{id}` returns created resource.
- `PUT/PATCH /booking/{id}` updates fields; `DELETE` removes the resource.

**Negative**

- Unauthorized requests (missing/invalid token) rejected appropriately.
- Invalid payloads (types, missing fields) return 4xx/5xx per spec.
- Contract validation: response schema with AJV for create/read/update.

**Non‑functional**

- **SLA**: p95 latency budget for `GET /booking` (10 samples).
- **Security sanity**: assert secure headers and JSON content type.

## Test design

- Every run creates its own resource(s) and cleans up.
- API client helpers in `support` centralize calls and assertions.
- No fixed sleeps; retries on network instabilities.

## Environments

- Default public demo; override base URL via `BOOKER_BASE_URL`.

## Entry/Exit

- Entry: API reachable.
- Exit: All critical CRUD and auth pass; p95 under budget; no schema regressions.

## Reporting

- Cypress artifacts + optional JUnit for CI dashboards.

## Risks & mitigations

- Demo instability → retries & tolerant assertions for non‑critical endpoints.
- Rate limiting → sample counts tuned; backoff on HTTP 429.
