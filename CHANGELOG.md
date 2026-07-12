# 1.0.3 — final pre-code simplification

- Consolidated conflict resolution into one canonical rule.
- Removed DOCX duplicates, unused checksums, duplicate Cursor rule references, and parallel AI rule sets.
- Reduced AI continuity from ten state files to four.
- Added canonical domain boundaries and a typed AI-to-code contract to the Engineering Bible.
- Added the first one-week user value test and vertical product milestone.
- Deferred unused packages until real shared-code demand exists.
- Extended context validation to detect obsolete duplicates and ADR coverage.
- Documentation freeze reaffirmed: the next meaningful repository change must include executable code.

# Changelog

## 1.0.2 — 2026-07-12

- Fixed repository/documentation drift found during independent AI review.
- Synchronized `VERSION` and `PROJECT_STATE.json`; validator now checks them.
- Approved the minimal P0 technology baseline and recorded it in ADR.
- Declared `docs/product/development-roadmap.md` the only canonical product phase roadmap.
- Reframed Engineering Bible phases as non-canonical technical milestones.
- Moved authentication out of P0 into a later dedicated task.
- Declared `apps/*` and `packages/*` the canonical physical repository layout.
- Marked the flat module list in AI Engineering Bible as a conceptual domain map only.
- Frozen documentation changes except for real contradictions, implemented decisions, or product behavior changes.

## 1.0.1 — 2026-07-12

- Added the canonical `ai/SUPER_CURSOR_PROMPT.md`.
- Converted `ai/START_NEW_SESSION.md` into a short, unambiguous launcher.
- Added strict onboarding, implementation, verification, handover and product-digest protocols.

## 1.0.0 — 2026-07-12

- Consolidated all final product and engineering documents.
- Added Markdown mirrors for AI-readable context.
- Added AI session, handover, state, task and review protocols.
- Added repository validation scripts and GitHub templates.
- Established the initial repository skeleton; no application code yet.
