# AGENTS.md

This file defines how coding agents should work in this repository.

## Scope

- Applies to the whole repository unless a deeper `AGENTS.md` overrides part of it.

## Language Rules

- Everything written for people is in French: conversations, GitHub issues and their comments, pull request titles, bodies and review comments.
- Code is always in English: identifiers, comments, file names, and commit messages.

## Editing Guidelines

- Keep changes minimal and focused on the requested task.
- Follow existing style and file organization before introducing new patterns.
- Do not refactor unrelated areas unless required for the task.
- Avoid renaming public exports unless explicitly requested.
- Add a suffix to file names with to group concerns and help with file finding (ex: `forms/LoginForm.tsx` instead of just `forms/Login.tsx`, `forms/login-form.module.css` instead of just `forms/login.module.css`, `Repositories/UsersRepositories.php` instead of `Repositories/Users.php`). The only exception is base Entities which should not contain Entity suffix.

