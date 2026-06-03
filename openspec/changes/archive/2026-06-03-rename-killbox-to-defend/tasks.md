## 1. Audit

- [x] 1.1 Inventory all active `killbox`, `Killbox`, and `KILLBOX` references outside archived OpenSpec history.
- [x] 1.2 Classify each reference as player-facing copy, package/config metadata, deployment path, automation contract, source identifier, docs/spec text, or historical archive.
- [x] 1.3 Decide whether any temporary compatibility aliases are required for old debug globals or environment variables.

## 2. Product, Docs, and Specs

- [x] 2.1 Rename README, reference docs, public manifest, page titles/descriptions/headings, and static fallback HTML from Killbox to Defend.
- [x] 2.2 Update `openspec/config.yaml` and active consolidated specs so future changes describe Defend as the current project.
- [x] 2.3 Update package metadata and lockfile project names from `killbox` to `defend`.
- [x] 2.4 Leave archived OpenSpec changes untouched unless validation requires a specific archive adjustment.

## 3. Runtime and Automation Contracts

- [x] 3.1 Rename TypeScript runtime types and mount helpers from Killbox-specific names to Defend-specific names.
- [x] 3.2 Rename browser automation contracts from `window.__KILLBOX_DEBUG__`, `data-killbox-*`, and `killbox:*` to `window.__DEFEND_DEBUG__`, `data-defend-*`, and `defend:*`.
- [x] 3.3 Rename deployment and Playwright environment variables from `KILLBOX_*` and `VITE_KILLBOX_*` to `DEFEND_*` and `VITE_DEFEND_*`.
- [x] 3.4 Update unit and Playwright tests to assert the Defend contracts directly.

## 4. Deployment Paths

- [x] 4.1 Update Astro and Vite Pages base paths from `/killbox/` to `/defend/`.
- [x] 4.2 Update public deployment verification URL examples, route expectations, query parameters, and documentation to use the Defend path.
- [x] 4.3 Confirm any workflow configuration or deployment documentation still matches the actual repository Pages destination.

## 5. Validation

- [x] 5.1 Run TypeScript linting and unit tests.
- [x] 5.2 Run the production build and local browser verification where practical.
- [x] 5.3 Run OpenSpec validation.
- [x] 5.4 Run a final active-reference search and document any remaining `killbox` references as historical archive entries or intentional compatibility aliases.
