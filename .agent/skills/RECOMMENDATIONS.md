# Recommended Skills for PetCard Project

This document outlines **skills** that could be added to `.agent/skills/` to extend Antigravity's capabilities for this project.

---

## 1. `migration-helper/SKILL.md`

**Purpose**: Automate Alembic migration workflow.

**Capabilities**:
- Generate migration after model changes
- Validate migration script before applying
- Rollback support with safety checks

**Example Script** (`scripts/generate_migration.sh`):
```bash
#!/bin/bash
# Usage: ./generate_migration.sh "description"
cd src/backend
alembic revision --autogenerate -m "$1"
alembic upgrade head
pytest tests/ -v -k "test_" --tb=short
```

**When to trigger**: Any task modifying `models.py`.

---

## 2. `api-contract-checker/SKILL.md`

**Purpose**: Verify frontend API calls match backend schemas.

**Capabilities**:
- Parse `services/api.js` for endpoint calls
- Compare against `schemas.py` definitions
- Report mismatches (missing fields, wrong types)

**Implementation Approach**:
1. Extract endpoint URLs and payloads from `api.js`
2. Parse Pydantic schemas from `schemas.py`
3. Validate request/response shapes
4. Output report as Markdown

**When to trigger**: After modifying API endpoints or frontend service layer.

---

## 3. `test-coverage-check/SKILL.md`

**Purpose**: Ensure new code has corresponding tests.

**Capabilities**:
- Detect new functions/endpoints
- Check if test file exists
- Remind to add tests if missing

**Trigger conditions**:
- New file in `routes/` → expect test in `tests/test_<name>.py`
- New screen in `screens/` → expect test in `tests/screens/<Name>.test.jsx`

---

## 4. `schema-sync/SKILL.md`

**Purpose**: Keep documentation in sync with code.

**Capabilities**:
- Compare `models.py` with `DATA_MODEL_PHASE1.md`
- Compare `routes/*.py` with `API_SPEC_PHASE1.md`
- Generate diff or auto-update docs

**Trigger**: End of any backend task.

---

## 5. `telegram-lint/SKILL.md`

**Purpose**: Validate Telegram Mini App compliance.

**Capabilities**:
- Check for `@twa-dev/sdk` usage
- Verify `window.Telegram.WebApp` initialization
- Warn about unsupported features in Mini App context

**Trigger**: Frontend changes affecting Telegram integration.

---

## Implementation Priority

| Skill | Priority | Effort | Value |
|-------|----------|--------|-------|
| migration-helper | 🔴 High | Low | Prevents DB errors |
| api-contract-checker | 🟡 Medium | Medium | Catches integration bugs |
| schema-sync | 🟡 Medium | Low | Keeps docs current |
| test-coverage-check | 🟢 Low | Low | Nice to have |
| telegram-lint | 🟢 Low | Medium | Edge case prevention |

---

## How to Implement a Skill

Each skill is a folder in `.agent/skills/` containing:

```
.agent/skills/
└── skill-name/
    ├── SKILL.md          # Required: Instructions for the agent
    ├── scripts/          # Optional: Helper scripts
    │   └── run.sh
    └── examples/         # Optional: Reference patterns
```

**SKILL.md Format**:
```yaml
---
name: Skill Name
description: What this skill does
---

# Instructions

[Markdown instructions for when and how to use this skill]
```

---

> **Recommendation**: Start with `migration-helper` as it provides the most immediate value and has the lowest implementation effort.
