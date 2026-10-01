## Development Workflow

Branching follows Gitflow, kept light. `develop` is where development happens: every commit and every merge lands there first. `main` is production: it only receives `develop` when deploying to prod. The backlog is the repository's GitHub Issues; pull requests are where reviewed work lands. Most day-to-day work skips both: the issue/PR flow exists to run work in parallel and to review what deserves it, not to slow down small changes.

On GitHub, `develop` is the default branch (so PRs target it and `Closes #<number>` closes issues on merge), and the `bug`, `enhancement` and `in-progress` labels exist.

### Commit straight to `develop` (default)

- Small changes asked for directly in conversation: fixes, style or copy tweaks, translations, content. The request was reviewed by being asked for.
- Documentation, comments and config with no runtime effect.
- Run the checks before committing. Never push unless asked.

### Use an issue and a PR

- A feature or a chunk of work that spans several sessions, or needs a written plan.
- Work meant to run in parallel with other sessions.
- Risky or broad changes: migrations, refactors, dependencies, routing, or any diff the maintainer would want to read.
- Anything started from an existing issue.

What decides the flow is where the request came from and what it touches, not the size of the diff. When unsure, ask.

### Working an issue

1. Read the issue and its comments first; they may change the plan.
2. Add the `in-progress` label before starting: it stops a second session from picking the same issue. Remove it if the work is abandoned.
3. For an `enhancement`, write a short plan in the issue body before coding. `bug` issues skip the plan.
4. One branch per issue, prefixed by its type: `feature/<number>-<slug>` for an `enhancement`, `bug/<number>-<slug>` for a `bug` (other types follow the same pattern, e.g. `docs/`, `refactor/`). Branch from an up-to-date `develop`, in its own worktree under `.claude/worktrees/<number>-<slug>` so parallel sessions don't share a checkout.
5. Run the checks, push and open the PR against `develop` with `Closes #<number>` in its body, without asking. If the change couldn't be verified in the session, list the test scenario as a checkbox list in the PR body.
6. The issue closes when the PR merges into `develop`, never just because code was pushed. Remove the worktree (`git worktree remove`) once merged.

Something out of scope noticed along the way becomes a new issue (title, context, files involved) rather than growing the current change. Every issue carries a type label: `bug` or `enhancement`.

### Releasing to production

When deploying, merge `develop` into `main` (only when asked). An urgent fix for prod goes on a `hotfix/<slug>` branch from `main`, merged into `main` and then into `develop` so the two don't diverge.

### Checks

Run the project's lint, format, typecheck and test scripts (see `package.json` and `composer.json`) on what changed. When the codebase has pre-existing errors, a check passes when it reports nothing new in the files touched.

### Rules live in this file

Rules that always apply to this project (workflow, conventions, setup) are written here, not in an agent's private memory, so every session and every teammate shares them.
