# AI Life OS

AI Life OS is a personal operating system that helps a person capture thoughts, preserve memory, see what matters, and make better decisions without adding cognitive load.

## Current status

Pre-code. Documentation and agent handover are frozen at v1.0.3. The next task is P0-001: create a minimal Next.js/Fastify foundation.

## First product proof

After foundation, deliver one vertical slice: **enter text → preserve the exact original entry → show it in chronological history**.

## Start

1. Install Node.js and pnpm when P0 creates the workspace.
2. Open this folder in Cursor.
3. Paste `ai/START_NEW_SESSION.md` into a fresh chat.
4. Review the agent's plan before implementation.

## Important files

- `PROJECT_BRAIN.md` — product principles and conflict rule.
- `AGENTS.md` — working contract for AI engineers.
- `ai/state/` — current truth, next task, and session history.
- `docs/product/development-roadmap.md` — only canonical roadmap.
- `docs/adr/architecture-decisions.md` — only architecture decision source.

## Stack approved for P0

pnpm workspaces, Turborepo, strict TypeScript, Next.js, Fastify, Zod, GitHub Actions. PostgreSQL is reserved for later schema work.
