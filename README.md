# MarketCo2

Backend/API repository for MarketCo. No mobile/web frontend code in this repo.

## Prerequisites

- Node.js 20
- Docker + Docker Compose (for local Postgres)

## Environment variables

Copy `.env.example` to `.env` and adjust as needed.
Copy `.env.example` to `.env` in the repo root for Docker Compose and local runs.

| Variable | Description | Default |
| --- | --- | --- |
| `HOST` | Host interface for the API server | `0.0.0.0` |
| `PORT` | Port for the API server | `3000` |
| `DATABASE_URL` | Postgres connection string | `postgres://marketco:marketco@localhost:5432/marketco` |

## Run locally in 5 minutes
## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start Postgres and the API with Docker Compose:

   ```bash
   docker compose up --build
   ```

3. Verify the health endpoint:

   ```bash
   curl http://localhost:3000/health
   ```

Expected response:

```json
{"status":"ok"}
```

## Prisma

Canonical schema: `apps/api/prisma/schema.prisma`  
Migrations live in `apps/api/prisma/migrations`.

## Scripts

From the repo root:

- `npm run dev` — start the API in watch mode
- `npm run build` — build the API
- `npm run start` — run the built API
- `npm run test` — placeholder test script

## Authentication

The API exposes two endpoints for authentication:

- `POST /auth/register` with `{ "email": "user@example.com", "password": "..." }` to create a user.
- `POST /auth/login` with `{ "email": "user@example.com", "password": "..." }` to receive a JWT.

Auth endpoints are rate limited. Use `X-Request-Id` to supply a request ID header for tracing.

## Endpoints

- `GET /health`
- `GET /db/health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /me`








