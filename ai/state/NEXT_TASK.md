# Next Task - P1-002

## Status

Ready. Not started.

## Objective

Make the existing Memory UI shell interactive in the browser: submitting non-empty text adds the unchanged text to the visible history for the current page session.

## Required result

- the existing input and save button support submission;
- empty input is not added;
- submitted text appears unchanged in chronological history;
- the input clears after a successful submission;
- focused frontend tests cover the interaction.

## Out of scope

API calls, database storage, reload persistence, AI classification, authentication, new packages, and architecture changes.

## Acceptance criteria

A user can enter text and see the unchanged entry in the current in-memory history. Reloading may clear the history. Relevant format, lint, typecheck, tests, build, and context validation pass.
