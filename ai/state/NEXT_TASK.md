# Next Task — P0-001

## Objective

Initialize the smallest reproducible foundation. Do not implement product business logic.

## Required result

- pnpm workspace and Turborepo configuration;
- `apps/web`: minimal Next.js page that starts successfully;
- `apps/api`: minimal Fastify service with `GET /health`;
- strict TypeScript, ESLint, Prettier, test runner;
- health-check test;
- CI runs install, lint, typecheck, test, and build;
- exact local commands in README.

## Out of scope

Authentication, database schema, Memory, AI/LLM, pgvector, Redis, queues, mobile, design system implementation, analytics, and deployment infrastructure.

## Acceptance criteria

A clean checkout can install dependencies and pass lint, typecheck, tests, and build using documented commands. The web page loads and `/health` returns a typed successful response.

## First product milestone after P0

P1 must deliver one vertical slice: enter text → preserve original text → show it in chronological history. No AI classification is required for that milestone.
