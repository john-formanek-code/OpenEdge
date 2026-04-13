# 3. Use Next.js App Router

Date: 2026-04-02

## Status

Accepted

## Context

The OpenEdge workspace application requires efficient routing, server-side data fetching, and a modern frontend architecture.

## Decision

We chose **Next.js App Router**.

- **App Router**: Enables features like Server Components, Server Actions, and nested layouts, which simplify the development of complex, data-driven interfaces.
- **Server Actions**: Used for handling mutations and server-side logic without additional API endpoints.
- **Client Components**: Used for interactive parts of the UI, like charts and complex state-driven widgets.

## Consequences

- Layouts and pages are mostly server-side by default.
- We use the `src/app` directory for routing.
- The `src/components` directory contains reusable UI components.
