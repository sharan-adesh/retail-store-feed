# Retail Store Pricing Platform

A full-stack web application for managing retail pricing records with JWT authentication, CSV upload, and search capabilities.

**Tech Stack:** React + TypeScript, Express + Node.js, PostgreSQL

---

## Expected Deliverables

- [System Context Diagram](docs/context-diagram.md)
- [Solution Architecture](docs/solution-architecture.md)
- [Design Decisions](docs/design-decisions.md)
- [Non-Functional Requirements Considered](docs/non-functional-requirements.md)
- [Assumptions](docs/assumptions.md)
- [Source for the Implementation](docs/source-of-implementation.md)

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Running Locally](#running-locally)
- [Running with Docker](#running-with-docker)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Documentation](#documentation)

---

## Prerequisites

- **Node.js** 16+ (18+ recommended)
- **PostgreSQL** 12+ (for local development)
- **Docker** & Docker Compose (for containerized deployment)
- **Task** (optional, for task runner)

---

## Running Locally

### 1. Database Setup

Ensure PostgreSQL is running locally with these credentials (or update `backend/.env`):
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=retail
DB_USER=autobot
DB_PASSWORD=adesh@228151
```

**Option A:** Use local PostgreSQL installation

**Option B:** Run PostgreSQL in Docker only
```bash
task infra
# This starts only the PostgreSQL container
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Start development server (with hot reload)
npm start

# Backend runs on http://localhost:8080
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend runs on http://localhost:8085
```

### 4. Access the Application

Open your browser to **http://localhost:8085**

1. Register a new account or log in
2. Upload CSV files with pricing data
3. Search, edit, and delete records

---

## Running with Docker

### Quick Start

From the root directory:

```bash
# Start all services (PostgreSQL + Backend + Frontend)
docker compose up --build

# Or use Task runner
task
```

This will start:
- **PostgreSQL** on port 5432
- **Backend API** on port 7086
- **Frontend** on port 7085

Check running containers and ports:
```bash
docker ps
```

### Access the Application

The frontend will be available at **http://localhost:7085**

### Stop All Services

```bash
docker compose down

# Or use Task runner
task clean
```

### Task Runner Commands

```bash
task           # Start all containers (default)
task infra     # Start PostgreSQL only
task clean     # Stop all containers
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login and get JWT token

### Pricing Records (Protected - requires JWT)
- `POST /api/upload` — Upload CSV file (columns: Store ID, SKU, Product Name, Price, Date)
- `GET /api/search` — Search records (query params: store_id, sku, product_name, from_date, to_date, min_price, max_price, limit, offset)
- `GET /api/records/:id` — Get single record
- `PUT /api/records/:id` — Update record
- `DELETE /api/records/:id` — Delete record

---

## Project Structure

```
retail-store-pricing-platform/
├── backend/
│   ├── app.ts                          # Express entry point
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts             # PostgreSQL connection pool
│   │   │   └── schema.ts               # Database schema initialization
│   │   ├── models/
│   │   │   ├── Price.ts                # Price record interfaces
│   │   │   └── User.ts                 # User interfaces
│   │   ├── services/
│   │   │   ├── PriceService.ts         # Price CRUD logic
│   │   │   └── UserService.ts          # Auth logic (bcrypt + JWT)
│   │   ├── routes/
│   │   │   ├── priceRoutes.ts          # Price API routes
│   │   │   └── authRoutes.ts           # Auth API routes
│   │   └── middleware/
│   │       └── auth.ts                 # JWT verification middleware
│   ├── Dockerfile                      # Backend Docker image
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/                 # React components
│   │   ├── pages/
│   │   │   └── LoginPage.tsx           # Login/Register page
│   │   ├── context/
│   │   │   └── AuthContext.tsx         # Auth state management
│   │   ├── api/
│   │   │   ├── priceApi.ts             # Price API calls
│   │   │   └── authApi.ts              # Auth API calls
│   │   ├── hooks/                      # Custom React hooks
│   │   └── types/                      # TypeScript interfaces
│   ├── Dockerfile                      # Frontend Docker image (nginx)
│   ├── nginx.conf                      # Nginx config (API proxy + SPA routing)
│   └── package.json
│
├── docs/
│   ├── context-diagram.md              # System context diagram
│   └── solution-architecture.md        # Detailed architecture doc
│
├── compose.yaml                        # Docker Compose configuration
├── taskfile.yaml                       # Task runner commands
└── README.md
```

---

## Security Features

- JWT-based authentication with 7-day token expiry
- Password hashing with bcrypt (10 salt rounds)
- Protected API routes with middleware
- Parameterized SQL queries (SQL injection protection)
- CORS enabled with configurable origins

---

## Development Notes

- Backend uses TypeScript with ES modules
- Frontend uses React 18 with Vite for fast HMR
- Database schema auto-initializes on startup
- All API responses are JSON
- Frontend uses Axios with JWT interceptor
