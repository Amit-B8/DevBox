# DevBox backend foundation

## What runs where

The existing Next.js App Router frontend still builds with `output: 'export'` and
`trailingSlash: true`. Cloudflare Pages continues serving `out/` with the same
`npm run build` command. There were no Next API routes or application analytics
in the inspected source; Contact previously directed people to the issue tracker.
Cloudflare account-side analytics/deployment settings are not visible in this repository.

A separate TypeScript Node HTTP service in `backend/` owns PostgreSQL access.
We deliberately do not add dynamic Next route handlers: static Pages cannot execute
them. Cloudflare settings, existing routes, SEO metadata, sitemap, robots, registry,
and tool calculations are unchanged. There is no hosting migration.

The frontend never receives `DATABASE_URL` or a gateway secret. Production requires
a separately deployed API with HTTPS and a private PostgreSQL connection. A future
gateway can proxy `/api/*`; the current static deployment does not do this automatically.

## Database and migrations

Drizzle ORM uses the `pg` driver with a five-connection pool and query timeouts.
`backend/schema.ts` defines:

- `tool_usage`: generated UUID, registry tool ID, action enum, UTC timestamp.
- `user_feedback`: generated UUID, optional registry tool ID, category enum,
  10–2000 character trimmed message, UTC timestamp.

No tool input/output, filename, IP address, cookie, visitor ID, or account is stored.
Feedback is free text and may contain information a sender chooses to include;
the form asks people not to send sensitive information. Treat feedback as untrusted
text in any future admin UI, never as HTML.

Initial SQL and Drizzle migration metadata live in `backend/migrations/`.
`npm run db:generate` creates future SQL from schema edits without connecting to a
database. Review SQL before applying it. The migration runner requires explicit
`ALLOW_DATABASE_MIGRATIONS=true`; neither builds nor API startup run migrations.
Use a migration role for schema changes and a more restricted application role in
production. Configure verified database TLS with your provider's certificate setup;
do not disable certificate verification.

## API

| Endpoint | Behavior |
| --- | --- |
| `GET /api/health/live` | Process liveness only; no database call |
| `GET /api/health` | Readiness: application and DB connectivity; 503 if DB unavailable |
| `POST /api/usage` | Strict `{toolId, action}`; 201 on success |
| `POST /api/feedback` | Strict `{category, message, toolId?}`; 201 on success |
| `GET /api/popular-tools` | Top 10 tool event counts over 30 days, minimum 5 events per tool |

Usage actions: `tool_view`, `calculate`, `convert`, `generate`, `copy_result`.
Feedback categories: `bug_report`, `feature_request`, `suggestion`, `general_feedback`.
Tool IDs are validated against `src/data/tools.ts` directly, not a duplicate list.
Popular results count events, not unique users; they are cached for 60 seconds per
process. Individual records and feedback are never exposed by a read endpoint.

Writes require JSON, an allowed Origin, and at most 12 KiB (including UTF-8 encoding).
Extra fields are rejected. Errors use 400/403/405/413/415/429/503 with generic service
errors rather than SQL or credentials. The API does not log request bodies.

## Disabled by default and abuse protection

Both frontend flags and server write flags default to false. A default Cloudflare
build makes no tracking requests and does not show the feedback form.

Local testing requires `NODE_ENV=development` and `ENABLE_LOCAL_WRITES=true`, plus
the individual server feature flags. This bypass is only for loopback-bound local
development; never expose that setup on the internet. The production Docker target
defaults to `NODE_ENV=production`; the Compose file explicitly overrides it locally.

Production writes require `ENABLE_PUBLIC_WRITES=true` AND a minimum 32-character
`WRITE_PROXY_SECRET` matched by the `X-DevBox-Proxy-Secret` header. Only a trusted
gateway may add this header, after stripping any incoming copy and enforcing rate
limits, bot/spam protection, payload limits, and origin restrictions. Keep the API
private to that gateway where possible. Never put this secret in a NEXT_PUBLIC
variable or the browser. CORS and Origin checks are not authentication or bot protection.

The built-in limiter allows 5 feedback submissions or 60 other requests per IP/path
per minute, with a 600-request global process cap and bounded memory. It uses the
socket address, not client-supplied forwarding headers. It is best-effort only:
replicas/restarts reset it, and all clients behind a proxy share its address.
The gateway must apply distributed per-client limits (including health/read traffic),
and appropriate bot challenges for feedback. Until that exists, KEEP PUBLIC WRITES OFF.
Counts are approximate and can be manipulated; do not use them for billing or rewards.

Tracking sends only ID/action after a successful conversion in PDF Combiner and
JSON/Markdown. It is fire-and-forget with a timeout, no retries, no cookies, no referrer,
and no persistent queue; failures never block tools. Do Not Track / Global Privacy
Control suppress tracking. Enabling anonymous analytics still requires a privacy
review and any consent mechanism required for the deployment's audience.

Before enabling collection, schedule `db:retention` daily: it deletes usage older
than 30 days and feedback older than 180 days. It requires explicit
`ALLOW_RETENTION_DELETE=true` and is not automatically run. Align backups, gateway
logs, deletion requests, and privacy notices with the same policy. Database retention
does not erase independent backups or hosting logs.

## Environment settings

Copy `.env.example` to `.env` locally. Never commit real values. Node API commands
load `.env`; Next also reads its standard environment files. Existing `.env.local`
values may override frontend settings. Compose reads `.env` for interpolation.

- `DATABASE_URL`: server-only PostgreSQL URL. Compose constructs it with internal host `db`.
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`: local Compose database values.
  Use a random URL-safe password (hex works) because Compose embeds it in a URL.
- `HOST`, `PORT`: API bind address/port; host development defaults to 127.0.0.1:3001.
- `ALLOWED_ORIGINS`: comma-separated exact frontend origins, without trailing slashes.
- `ENABLE_USAGE`, `ENABLE_FEEDBACK`: separate backend feature gates.
- `ENABLE_LOCAL_WRITES`: local-only bypass, ignored unless NODE_ENV is development.
- `ENABLE_PUBLIC_WRITES`, `WRITE_PROXY_SECRET`: production gateway gates described above.
- `NEXT_PUBLIC_API_BASE_URL`: public API origin, HTTPS except localhost; no path or secrets.
- `NEXT_PUBLIC_USAGE_ENABLED`, `NEXT_PUBLIC_FEEDBACK_ENABLED`: public build-time flags.
  Changing these requires restarting Next dev or rebuilding the static frontend.
- `ALLOW_DATABASE_MIGRATIONS`, `ALLOW_RETENTION_DELETE`: explicit maintenance opt-ins.

## Windows PowerShell: local setup

Start Docker Desktop with Linux containers. No commands below delete volumes.
The local Compose database has no published port and uses a persistent named volume.
Stop any existing `npm run dev` before starting the Docker frontend on port 3000.

```powershell
npm ci
if (!(Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
```

Choose a local POSTGRES password. For an explicit local test, set these in `.env`:

```dotenv
ENABLE_LOCAL_WRITES=true
ENABLE_USAGE=true
ENABLE_FEEDBACK=true
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_USAGE_ENABLED=true
NEXT_PUBLIC_FEEDBACK_ENABLED=true
```

These settings are local only. Production defaults must remain off until reviewed.

```powershell
docker compose config --quiet
docker compose up -d db
docker compose build api
docker compose run --rm -e ALLOW_DATABASE_MIGRATIONS=true api node backend-dist/migrate.cjs
docker compose up -d api
# For normal Next hot reload (recommended during development):
npm run dev
```

Or, instead of `npm run dev`, start the containerized static frontend:

```powershell
docker compose up -d --build app
```

Open http://localhost:3000/contact/ and submit a non-sensitive test message. Use
JSON/Markdown conversion or merge test PDFs, then inspect Network requests to confirm
the event body contains only `toolId` and `action`.

```powershell
Invoke-RestMethod http://localhost:3001/api/health
Invoke-RestMethod http://localhost:3001/api/popular-tools
# Schema generation does not access a database:
npm run db:generate
# Explicit maintenance, only when intentionally deleting expired local records:
docker compose run --rm -e ALLOW_RETENTION_DELETE=true api node backend-dist/retention.cjs
# Stop containers, keeping the database volume:
docker compose down
```

If you already have a separate LOCAL PostgreSQL server, set `DATABASE_URL` to it and
use `npm run dev:api` (NODE_ENV=development). To migrate it explicitly:

```powershell
$env:ALLOW_DATABASE_MIGRATIONS = 'true'
npm run db:migrate
Remove-Item Env:ALLOW_DATABASE_MIGRATIONS
$env:NODE_ENV = 'development'
npm run dev:api
```

Do not point these commands at production without a reviewed migration/backup plan.
Do not run `docker compose down -v`: that would delete the database volume.

## Containers and future Kubernetes

The multi-stage Dockerfile builds the existing Next static export and a bundled Node
API separately. The frontend uses unprivileged Nginx on 8080; the API uses the Node
user on 3001. Neither image contains `.env` files or database credentials. Compose
publishes app/API ports on 127.0.0.1 only; PostgreSQL uses an internal network.
The frontend speaks to the API, never directly to PostgreSQL.

The API stores durable state only in PostgreSQL. Future Deployments/Services/Ingress
can use the liveness and readiness routes, runtime ConfigMaps/Secrets, and graceful
shutdown. Use a single migration job, managed DB/backups, TLS, distributed gateway
limits, sensible replica connection budgets, and resource limits. Frontend public
settings remain build-time values. No Kubernetes manifests or cluster dependencies
are introduced. Pin reviewed container image digests before production rollout.

## Checks

```powershell
npm run lint
npm run typecheck
npm run test:backend
npm run build:backend
npm run build
docker compose config --quiet
```

Tests use an in-memory store, not a real database. Container/migration integration
requires a running Docker engine; successful source checks alone do not prove a
deployed PostgreSQL connection or public gateway is configured.

Reference: [Drizzle PostgreSQL setup](https://orm.drizzle.team/docs/get-started-postgresql).
