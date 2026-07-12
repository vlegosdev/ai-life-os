# Next Task - P1-008

## Status

Ready. Not started.

## Objective

Let the user filter the loaded Memory history by one existing deterministic category without changing backend storage or search behavior.

## Required result

- one compact category filter near the history search input;
- options for all categories plus all entries;
- category filtering composes with the current text search;
- clearing the filter restores the full newest-first history;
- a compact empty state appears when no entry matches.

## Out of scope

Backend filtering, multi-select, counts, sorting, grouping, export, AI, and new dependencies.

## Acceptance criteria

The user can select one category and see only matching entries while search, deletion, correction, and newest-first ordering remain intact. Relevant format, lint, typecheck, tests, build, and context validation pass.
