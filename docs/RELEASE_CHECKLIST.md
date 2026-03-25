# Release Checklist (v1.0.0)

## Pre-release
- [ ] `pnpm install`
- [ ] `pnpm check`
- [ ] Verify `.env.example` is up to date
- [ ] Confirm no secrets are committed

## GitHub
- [ ] Push branch: `git push origin main`
- [ ] Push tag: `git push origin v1.0.0`
- [ ] Create GitHub Release from tag `v1.0.0`
- [ ] Attach release notes (highlights + breaking changes)

## Vercel
- [ ] Import/connect GitHub repository
- [ ] Set env vars:
  - `AUTH_SECRET`
  - `AUTH_PASSWORD`
  - `DATABASE_URL`
  - `DATABASE_AUTH_TOKEN` (if required)
- [ ] Trigger deployment from `main`
- [ ] Verify health endpoint: `/api/health`
- [ ] Verify login flow and protected routes

## Post-release
- [ ] Smoke test core pages (`/`, `/watch`, `/lab`, `/settings`)
- [ ] Smoke test API routes
- [ ] Confirm DB writes/reads in production
- [ ] Monitor Vercel logs for runtime errors
