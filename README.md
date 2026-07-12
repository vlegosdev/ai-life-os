# AI Life OS

AI Life OS is a personal operating system that helps a person capture thoughts, preserve memory, see what matters, and make better decisions without adding cognitive load.

## Current status

P0 foundation is in place: a pnpm/Turborepo monorepo with a minimal Next.js web app and Fastify API health check.

## Requirements

- Node.js 20+
- pnpm 9 (`corepack enable` recommended)

## Local commands

From the repository root:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Run apps locally:

```bash
pnpm --filter @ai-life-os/web dev
pnpm --filter @ai-life-os/api dev
```

- Web: http://localhost:3000
- API health: http://localhost:3001/health

## First product proof

After foundation, deliver one vertical slice: **enter text → preserve the exact original entry → show it in chronological history**.

## Important files

- `PROJECT_BRAIN.md` — product principles and conflict rule.
- `AGENTS.md` — working contract for AI engineers.
- `ai/state/` — current truth, next task, and session history.
- `docs/product/development-roadmap.md` — only canonical roadmap.
- `docs/adr/architecture-decisions.md` — only architecture decision source.

## Stack (P0)

pnpm workspaces, Turborepo, strict TypeScript, Next.js, Fastify, Zod, Vitest, GitHub Actions. PostgreSQL is reserved for later schema work.
