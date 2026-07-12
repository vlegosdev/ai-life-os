# Next Task - P1-003

## Status

Ready. Not started.

## Objective

Create the smallest durable Memory storage layer so immutable original text and its creation time survive process restarts.

## Required result

- minimal PostgreSQL setup using the already approved foundation choice;
- one Memory table containing original text and authoritative creation metadata;
- original text is stored without AI interpretation;
- focused persistence tests cover insertion and chronological retrieval;
- exact local database commands are documented in the existing README.

## Out of scope

Web integration, authentication, AI classification, derived entities, queues, caches, search, embeddings, and speculative abstractions.

## Acceptance criteria

The persistence layer stores the original Memory text durably and retrieves entries in chronological order. Relevant format, lint, typecheck, tests, build, and context validation pass.
