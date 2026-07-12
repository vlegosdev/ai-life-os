# AI Life OS — AI Collaboration and Handover

## Purpose

Different AI accounts can continue the project without trusting chat memory. The repository stores only the minimum continuity needed.

## Persistent sources

- `PROJECT_BRAIN.md`: product direction and conflict resolution.
- `AGENTS.md` and `.cursor/rules/`: executable working rules.
- `docs/adr/architecture-decisions.md`: durable architecture decisions.
- `ai/state/PROJECT_STATE.json`: compact machine-readable state.
- `ai/state/CURRENT_STATE.md`: human-readable verified reality.
- `ai/state/NEXT_TASK.md`: one active next task.
- `ai/state/SESSION_LOG.md`: append-only history of meaningful work.

## Session start

Read the files listed in `AGENTS.md`, inspect the actual repository, report inconsistencies, and propose a short plan. Do not reread every long reference document for a narrow task.

## Session end

Run relevant checks and the context validator. Update the four state files. The final digest must distinguish verified work, unverified work, missing work, risks, and the next task.

## Anti-bureaucracy rule

A one-line fix should not create an ADR or update unrelated documents. State updates must be concise. Git history and tests carry implementation detail; handover files carry only information the next AI needs to continue safely.
