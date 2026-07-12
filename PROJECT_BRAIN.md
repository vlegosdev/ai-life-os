# AI Life OS — Project Brain

> Primary product and engineering context. Read before changing code.

## What we are building

AI Life OS is a personal operating system that helps a person capture thoughts, preserve memory, see what matters, and make better decisions without creating more cognitive load.

It is **not** a generic todo app, notes app, finance tracker, social network, or engagement machine.

## Product promise

A user can write one natural-language entry. The system preserves the original text, turns it into structured context when useful, and shows only the next information or action that matters.

## First usable outcome

The first real product milestone is deliberately small:

> A user opens the web app, writes one thought, the original text is saved reliably, and the user can see it in a chronological history.

No AI classification, finance, HUD scoring, authentication, mobile app, or integrations are required to prove this milestone.

## Core principles

1. Reduce cognitive load.
2. Preserve original user input before interpretation.
3. AI advises; the user decides.
4. Deterministic facts—money, dates, authorization, scores—are computed in code.
5. Explainability over magic.
6. KISS and YAGNI over hypothetical scale.
7. A working vertical slice is more valuable than additional process.

## Canonical conflict rule

When sources disagree, use this order:

1. passing tests and executable checks;
2. current code, database migrations, and runtime configuration;
3. accepted ADR in `docs/adr/architecture-decisions.md`;
4. current state in `ai/state/PROJECT_STATE.json`, `CURRENT_STATE.md`, and `NEXT_TASK.md`;
5. canonical roadmap in `docs/product/development-roadmap.md`;
6. reference documents in `docs/`;
7. old chat history or assumptions.

Report every conflict. Do not silently choose a convenient source.

## Current physical layout

- `apps/web` — web application;
- `apps/api` — API application;
- `packages/config` — shared configuration only when P0 creates it;
- `docs` — stable product and engineering references;
- `ai/state` — minimal continuity between changing AI sessions.

Do not create more packages until two real consumers need shared code.

## Completion rule

A task is complete only when acceptance criteria pass, relevant checks pass, current state is truthful, and the next task is clear.
