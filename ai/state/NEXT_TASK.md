# Next Task - P1-004

## Status

Ready. Not started.

## Objective

Show each Memory entry's authoritative `createdAt` value in the existing history without changing capture or storage behavior.

## Required result

- each history item shows a concise local creation date and time;
- ordering continues to use the API's newest-first response;
- invalid dates do not break the history screen;
- focused verification covers date rendering.

## Out of scope

Editing, deleting, pagination, search, relative-time updates, user timezone settings, authentication, and AI.

## Acceptance criteria

Persisted history remains readable after refresh and displays a creation time for every valid entry. Relevant format, lint, typecheck, tests, build, and context validation pass.
