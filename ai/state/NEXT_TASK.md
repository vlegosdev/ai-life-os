# Next Task - P1-006

## Status

Ready. Not started.

## Objective

Let the user export the complete stored Memory history as a JSON file without changing or interpreting any entry.

## Required result

- one small export control near the history section;
- exported data includes each entry's existing `id`, `text`, and `createdAt`;
- export includes the full newest-first history regardless of the active search query;
- export failure uses the existing compact error treatment.

## Out of scope

Import, CSV, cloud sync, authentication, classification, creation-time display, analytics, and new dependencies.

## Acceptance criteria

The user can download a valid JSON representation of the complete current Memory history without modifying stored data. Relevant format, lint, typecheck, tests, build, and context validation pass.
