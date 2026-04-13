# 5. Simple Password-Based Authentication

Date: 2026-04-02

## Status

Accepted

## Context

OpenEdge is currently designed as a personal or small-team trading workspace, requiring basic access control without the overhead of a full identity provider.

## Decision

We use a simple, password-based authentication system with JWTs stored in `httpOnly` cookies.

- **`jose` library**: Used for lightweight JWT signing and verification.
- **`AUTH_PASSWORD` and `AUTH_SECRET`**: Environment variables used to manage access.
- **Server Actions & Cookies**: Used for `login`, `logout`, and `getSession` handling within Next.js.
- **`httpOnly` cookies**: Ensuring secure session storage.

## Consequences

- Low architectural overhead for single-user access.
- Easy to deploy on Vercel using environment variables.
- Does not support multiple users or granular roles out of the box.
