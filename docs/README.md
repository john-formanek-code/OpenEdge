# OpenEdge

## Local development

1. Install dependencies:

```bash
pnpm install
```

2. Create environment file:

```bash
cp .env.example .env.local
```

3. Run app:

```bash
pnpm dev
```

App runs at `http://localhost:2500`.

## Production environment variables

Set these in Vercel Project Settings:

- `AUTH_SECRET` (required): long random secret used to sign session JWTs.
- `AUTH_PASSWORD` (required): login password for the protected app.
- `DATABASE_URL` (required): use a managed libSQL/Turso URL in production (for example `libsql://...`).
- `DATABASE_AUTH_TOKEN` (optional): needed for authenticated managed libSQL/Turso instances.

## Deploy on Vercel

1. Push repository to GitHub.
2. Import the repo in Vercel.
3. Configure the environment variables above.
4. Deploy.

Build command: `pnpm build`  
Output: Next.js default output (no custom `vercel.json` required).

## Database notes

- Local development can use `file:sqlite.db`.
- Vercel filesystem is ephemeral, so local SQLite files are not durable in production.
- `/api/backup` is only enabled when `DATABASE_URL` points to a local file database.
