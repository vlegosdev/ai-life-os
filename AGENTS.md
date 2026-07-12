# Instructions for AI Agents

The repository—not chat history—is the source of continuity.

## Start of every new session

Read, in order:

1. `PROJECT_BRAIN.md`
2. `ai/context/PROJECT_CONTEXT.md`
3. `ai/state/PROJECT_STATE.json`
4. `ai/state/CURRENT_STATE.md`
5. `ai/state/NEXT_TASK.md`
6. the latest entry in `ai/state/SESSION_LOG.md`
7. only the documents relevant to the active task

Do **not** read every long Bible for a narrow task unless it is relevant.

## Before coding

- inspect the actual repository;
- summarize what is verified, missing, and inconsistent;
- provide a short plan and affected files;
- stay inside the active task;
- ask only when a product or irreversible architecture decision is genuinely ambiguous.

## Engineering rules

- strict TypeScript;
- no `any` without an explicit, documented boundary;
- domain logic stays outside UI and infrastructure;
- original user input is persisted before AI interpretation;
- LLM output is untrusted and schema-validated;
- LLM never performs authoritative money, date, authorization, or score calculations;
- no new package, queue, cache, service, or abstraction without a current need.

## End of every meaningful task

Update only four continuity files:

- `ai/state/PROJECT_STATE.json`
- `ai/state/CURRENT_STATE.md`
- `ai/state/NEXT_TASK.md`
- append to `ai/state/SESSION_LOG.md`

Create or amend an ADR only for a durable architecture decision. Run `python scripts/validate_project_context.py` and relevant project checks.

Your final digest must explain in plain language: what changed, what was verified, what remains, risks, and the next task.
