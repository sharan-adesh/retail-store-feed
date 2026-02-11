# Non-Functional Requirements

## Security

- JWT (HS256, 7-day expiry), bcrypt (10 rounds)
- Parameterized queries (no SQL injection)
- Middleware protects all /api routes except /auth
- localStorage for tokens (XSS risk accepted for simplicity)
- Future scope: CSRF, rate limiting, OAuth

## Performance

- DB indexes on store_id, sku, date
- Connection pooling (max 20)
- Vite builds ~180KB
- Search < 100ms, Login ~150ms

## Scalability

Stateless backend. JWT contains auth. Can spin up multiple instances behind load balancer.

**Bottlenecks:** DB writes, connection pool limit.

## Availability

- Docker auto-restarts
- Health endpoint: /health

**Future Scope:** Redundancy, backups, disaster recovery.

## Reliability

PostgreSQL ACID. Transactions for uploads. Try-catch at routes. Proper HTTP codes.

**Future Scope:** Automated backups, monitoring, alerting.

## Portability

Docker + .env config. Runs anywhere (local, cloud, any provider).

## Testability

Manual testing for now.

**Future Scope:** Jest (unit), Supertest (integration), Cypress (E2E). Target 80% coverage.

---

**Trade-off:** Small working prototype over more fancy features.
