# AGENTS.md

This file defines repository-specific instructions for coding agents working in this project.

## Language Rules

- Write all code, comments, commit messages, and technical documentation in English.
- User-facing chat replies may be in French when requested.

## Repository Context

- Monorepo using npm workspaces with packages in `packages/*`.
- Lerna is configured with independent versions.

## Working Rules

- Keep changes minimal and scoped to the requested task.
- Do not refactor unrelated files.
- Preserve existing coding style and conventions in touched files.
- Prefer fixing root causes over adding temporary workarounds.
- Avoid adding new dependencies unless clearly necessary.

## Refactor rules
- Javascript files should be converted to typescript
- Remove prop-types on components and favor typescript interface

## Style rules
- Use Typescript
- Prefer function functionName() {} over const functionName = () => {}
- Split tests in separate files according to source file being tested

## Validation Checklist
2. Run prettier
1. Run linter
3. If a package in `packages/` changed, add a changeset (see "Releases" below)

## Releases

- Every pull request that changes a package in `packages/` includes a changeset, created with `npx changeset --patch|--minor|--major <package> -m "<changelog line>"` (`npx changeset` alone is interactive). A change that doesn't need a release (package README, tests) takes `npx changeset --empty`. The Changeset check fails the pull request otherwise. See "Releases" in `Readme.md`.
- Never publish from a local machine (`lerna publish`, `npm publish`): the Release workflow publishes with npm trusted publishing.
- Running `scripts/trust-packages.sh` changes npm package settings and needs the maintainer's 2FA: leave it to the maintainer.

## File and Safety Rules

- Never remove or rewrite unrelated user changes.
- Do not run destructive git operations unless explicitly requested.
- Ask before actions that require network access or escalated permissions.

## Change Reporting

When finishing work, provide:

1. What changed.
2. Why it changed.
3. Which checks were run and their outcome.
4. Any remaining risks or follow-up actions.
