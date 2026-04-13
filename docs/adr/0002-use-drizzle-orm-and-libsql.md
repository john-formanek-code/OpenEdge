# 2. Use Drizzle ORM and libSQL/SQLite

Date: 2026-04-02

## Status

Accepted

## Context

We need an ORM and a database for the OpenEdge trading workspace. The app is built with Next.js and deployed on Vercel.

## Decision

We chose **Drizzle ORM** and **libSQL/SQLite**.

- **Drizzle ORM**: Provides a TypeScript-first, lightweight ORM that is fast and has great developer experience.
- **libSQL/SQLite**: Allows for local development with `sqlite.db` and seamless production deployment using Turso/libSQL, which is compatible with SQLite but optimized for the edge.

## Consequences

- We use `drizzle-kit` for migrations and schema management.
- Local data is stored in `sqlite.db`.
- Production data will be stored in a libSQL compatible database (e.g., Turso).
