# MarketCo2

Backend/API repository for MarketCo. No mobile/web frontend code in this repo.

## Prerequisites

- Node.js 20
- Docker + Docker Compose (for local Postgres)

## Environment variables

Copy `.env.example` to `.env` and adjust as needed.

| Variable | Description | Default |
| --- | --- | --- |
| `HOST` | Host interface for the API server | `0.0.0.0` |
| `PORT` | Port for the API server | `3000` |
| `DATABASE_URL` | Postgres connection string | `postgres://marketco:marketco@localhost:5432/marketco` |

## Run locally in 5 minutes

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

## Scripts

From the repo root:

- `npm run dev` — start the API in watch mode
- `npm run build` — build the API
- `npm run start` — run the built API
- `npm run test` — placeholder test script
