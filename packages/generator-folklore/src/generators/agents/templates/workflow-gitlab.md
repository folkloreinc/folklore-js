## Development Workflow

Branching follows Gitflow, kept light. `develop` is where development happens: every commit and every merge lands there first. `main` is production: it only receives `develop` when deploying to prod. The backlog is the repository's GitLab issues; merge requests are where reviewed work lands. Most day-to-day work skips both: the issue/MR flow exists to run work in parallel and to review what deserves it, not to slow down small changes.

Use `glab` for every GitLab operation (read `.agents/skills/glab/SKILL.md` first when it exists). On GitLab, `develop` is the default branch (so MRs target it and `Closes #<iid>` closes issues on merge), and the `bug`, `feature` and `in-progress` labels exist.

### Work straight on `develop` (default)

- Small changes asked for directly in conversation: fixes, style or copy tweaks, translations, content.
- Documentation, comments and config with no runtime effect.
- Run the checks, then stop and leave the changes uncommitted: the maintainer reviews them before they land. Commit only when explicitly asked to. Never push unless asked.

### Use an issue and an MR

- A feature or a chunk of work that spans several sessions, or needs a written plan.
- Work meant to run in parallel with other sessions.
- Risky or broad changes: migrations, refactors, dependencies, routing, or any diff the maintainer would want to read.
- Anything started from an existing issue.

What decides the flow is where the request came from and what it touches, not the size of the diff. When unsure, ask.

### Working an issue

1. Read the issue and its comments first; they may change the plan.
2. Assign yourself and add the `in-progress` label before starting: it stops a second session from picking the same issue. Remove it if the work is abandoned.
3. For a `feature`, write a short plan in the issue description before coding. `bug` issues skip the plan.
4. One branch per issue, prefixed by its type: `feature/<iid>-<slug>` for a `feature`, `bug/<iid>-<slug>` for a `bug` (other types follow the same pattern, e.g. `docs/`, `refactor/`). Branch from an up-to-date `develop`, in its own worktree under `.claude/worktrees/<iid>-<slug>` so parallel sessions don't share a checkout.
5. Commit on the issue branch as the work progresses, without asking: the MR is where the review happens. Run the checks, push and open the MR against `develop` with `Closes #<iid>` in its description, without asking. If the change couldn't be verified in the session, list the test scenario as a checkbox list in the MR description.
6. The issue closes when the MR merges into `develop`, never just because code was pushed. Remove the worktree (`git worktree remove`) once merged.

Something out of scope noticed along the way becomes a new issue (title, context, files involved) rather than growing the current change. Every issue carries a type label: `bug` or `feature`.

### Releasing to production

When deploying, merge `develop` into `main` (only when asked). An urgent fix for prod goes on a `hotfix/<slug>` branch from `main`, merged into `main` and then into `develop` so the two don't diverge.

### Checks

Run the project's lint, format, typecheck and test scripts (see `package.json` and `composer.json`) on what changed. When the codebase has pre-existing errors, a check passes when it reports nothing new in the files touched.

### Rules live in this file

Rules that always apply to this project (workflow, conventions, setup) are written here, not in an agent's private memory, so every session and every teammate shares them.
