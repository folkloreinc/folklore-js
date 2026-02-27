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
