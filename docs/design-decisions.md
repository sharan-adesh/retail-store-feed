# Design Decisions

## Tech Stack

- **Frontend:** React + Vite: Scalable and maintainable SPA
- **Backend:** Node.js + Express: Lightweight, non-blocking I/O
- **Database:** PostgreSQL: ACID compliant, relational database
- **Language:** TypeScript: Catches type errors.

---

## Request Flow

User clicks → HTTP request → Express route → Service logic → PostgreSQL → Response.

This is a simple and predictable flow and easy to debug.

---

## Security

- Passwords hashed with bcrypt (rounds: 10)
- JWT tokens expire after 7 days
- Parameterized queries prevent SQL injection
- Tokens stored in localStorage (survives refresh)

---

## Frontend State Management

React Context API. We could use Redux but we don't need it yet. Only global state is auth. Context works fine. Redux adds complexity we don't have.

---

## File Upload

Check CSV format → Parse data → Validate → Database transaction → Return result.

Fail fast. All-or-nothing commits. No partial updates.

---

## Port Mapping

| Setup | Frontend | Backend | Database |
|-------|----------|---------|----------|
| Local | 8085 | 8086 | 5432 |
| Docker | 7085 | 7086 | 5432 |

Avoiding common ports.

---

## Code Organization

**Backend:**
- `config/`: Database setup
- `models/`: TypeScript interfaces
- `services/`: Business logic, queries
- `routes/`: HTTP endpoints
- `middleware/`: Auth checks

**Frontend:**
- `components/`: Reusable UI
- `pages/`: Route pages
- `context/`: Auth state
- `hooks/`: Logic hooks
- `api/`: HTTP calls + interceptors

---

## Configuration

Single `.env` file. Database credentials, ports, JWT secret. Loaded at startup. In Docker, only DB_HOST gets overridden for the container network.

---

## Monorepo

Frontend and backend in one repo. Single deploy. Easier to coordinate changes. Works for small teams. If we split later, it's possible but would need separate CI/CD.

---

## API

REST. JSON responses. Public endpoints: /auth/register, /auth/login. Everything else requires Bearer token.

---

## Testing

Currently manual for this assignment. In future: Jest for unit tests and Cypress for E2E. Target 80% coverage on critical paths.
