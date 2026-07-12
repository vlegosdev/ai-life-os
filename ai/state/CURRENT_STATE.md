# Current State

## Verified

- P0-001 is complete.
- The repository uses pnpm workspaces and Turborepo.
- `apps/web` is a minimal Next.js application that builds successfully.
- `apps/api` is a minimal Fastify service with a typed `GET /health` response.
- The health route is covered by a passing Vitest injection test.
- Strict TypeScript, ESLint, Prettier, and GitHub Actions checks are configured.
- Install, lint, typecheck, test, build, and project-context validation pass.
- P1-001 introduced the first visible Memory UI shell with a text input, save button, and history section.
- The UI shell is responsive, keyboard accessible, and implemented without new dependencies.
- P1-002 adds browser-memory capture through the save button or Enter.
- Input is trimmed, empty submissions are ignored, successful submissions clear the input, and newest entries appear first.
- P1-003 persists entries to `local-data/entries.json` through `GET /entries` and `POST /entries`.
- Each entry has an API-generated UUID and creation timestamp; surrounding whitespace is trimmed while internal wording is preserved.
- The web app loads history on page load, saves through the API, survives refreshes, and shows compact load/save errors.
- P1-004 adds confirmed deletion through `DELETE /entries/:id` using the existing serialized atomic write path.
- Successful deletion updates the visible history immediately and survives refresh; missing IDs return 404 without modifying other entries.
- P1-005 adds frontend-only history search with trimmed, case-insensitive substring matching.
- Search updates as the user types, preserves newest-first order, shows a compact no-results state, and remains compatible with deletion.
- P1-006 adds deterministic local categories: `task`, `expense`, `goal`, `idea`, and fallback `note`.
- Legacy entries are classified and atomically upgraded on load without changing original text, IDs, timestamps, or ordering.
- Users can persist a manual category correction through `PATCH /entries/:id`; stored corrections override automatic classification.
- P1-007 displays `createdAt` in the user's local timezone as today, yesterday, or an older date with a conditional year.
- Missing and invalid legacy timestamps are omitted without affecting entry text, categories, search, correction, or deletion.
- The web workspace now runs focused Vitest unit tests for deterministic date formatting.

## Not implemented

- multi-user or concurrent-process storage;
- edit, pagination, category filtering, and export;
- authentication;
- AI integration;
- finance, goals, HUD, insights, attention guardian, and companion.

## Current architecture

The physical foundation contains only `apps/web` and `apps/api`. P1 uses a single local JSON file for minimal durable storage; PostgreSQL remains deferred. Shared packages are deferred until two real consumers need them.

## Documentation status

Documentation remains frozen at v1.0.3. The four continuity files reflect the completed P1-007 creation-time display and identify P1-008 as ready but not started.
