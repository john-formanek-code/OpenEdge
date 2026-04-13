# 4. Data Modeling and Tracking

Date: 2026-04-02

## Status

Accepted

## Context

The OpenEdge workspace needs to track complex trading hypotheses, market states, trade plans, executions, and behavioral data (like rule violations).

## Decision

We use a comprehensive relational schema defined with Drizzle ORM.

- **Hypotheses**: Central table for tracking trade ideas, symbols, biases, and status.
- **Market States**: Tracking regimes and key market events.
- **Trade Plans & Executions**: Detailed tracking of risk, entries, exits, and actual execution data (slippage, fees).
- **Behavioral Tracking**: `rule_violations` table to track psychology and execution errors (FOMO, revenge trading, etc.).
- **Audit Trail**: Capturing changes to hypotheses for historical analysis and review.

## Consequences

- All core entities are strictly typed via Drizzle schema.
- We maintain referential integrity between hypotheses, plans, and executions.
- Data can be easily exported or backed up (via `/api/backup`).
