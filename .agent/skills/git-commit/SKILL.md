---
name: git-commit
description: Stage all changes, commit with a descriptive message, and push to origin
---

# Git Commit & Push Skill

Automates the git workflow: stage → commit → push.

## When to Use
- After completing a task or feature
- When user says "закоммить", "запуш", "commit", "push"
- At the end of any implementation task

## Execution Steps

1. **Check status**
   ```bash
   git status --short
   ```

2. **Stage all changes**
   ```bash
   git add .
   ```
   
   > If `.agent/` files need to be added, use `git add -f .agent/...`

3. **Generate commit message**
   - Format: `<type>: <description>`
   - Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
   - Keep under 72 characters
   - Use English

4. **Commit**
   ```bash
   git commit -m "<type>: <description>"
   ```

5. **Push to origin**
   ```bash
   git push
   ```

6. **Report result**
   - Show commit hash
   - Show files changed
   - Confirm push success

## Output Format

```
✅ Git Commit Complete
======================
Commit: abc1234
Message: feat: Add vaccine reminder feature
Files changed: 5
Pushed to: origin/main
```

## Error Handling

| Error | Action |
|-------|--------|
| Nothing to commit | Report "No changes to commit" |
| Push rejected | Run `git pull --rebase` then retry push |
| Merge conflict | Stop and notify user |
