# OpenEdge

Trading workspace app built with Next.js App Router, React 19, and Drizzle ORM.

## Stack
- Next.js 16
- React 19
- TypeScript
- Drizzle ORM + SQLite/libSQL

## Local development
```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

App runs on `http://localhost:2500`.

## Environment variables
See `.env.example`.

Required for production:
- `AUTH_SECRET`
- `AUTH_PASSWORD`
- `DATABASE_URL`

Optional:
- `DATABASE_AUTH_TOKEN`

## Deploy to Vercel
1. Push this repo to GitHub.
2. Import project in Vercel.
3. Set environment variables from `.env.example`.
4. Deploy.

Build command:
```bash
pnpm build
```

## Quality checks
```bash
pnpm check
```

## Open source
- License: MIT (`LICENSE`)
- Security policy: `SECURITY.md`
- Contributing guide: `CONTRIBUTING.md`
- Code of conduct: `CODE_OF_CONDUCT.md`

Additional docs: [docs/README.md](docs/README.md)
