# Agent Readiness Checks

Please instruct each agent to perform the following self-checks to ensure we are ready for Phase 1 execution.

## 1. Backend Agent
**Task:** Verify Model & API Alignment
**Prompt:**
> "Backend Agent, run a readiness check.
> 1. Verify that `src/backend/models.py` exactly matches the schema definitions in `DATA_MODEL_PHASE1.md`.
> 2. Confirm that you have all necessary information to implement the endpoints listed in `API_SPEC_PHASE1.md`.
> 3. Check if `src/backend/requirements.txt` includes all necessary dependencies (fastapi, uvicorn, sqlalchemy, alembic, asyncpg, python-telegram-bot).
> Report any discrepancies or missing specs."

## 2. Frontend Agent
**Task:** Verify UI & API Alignment
**Prompt:**
> "Frontend Agent, run a readiness check.
> 1. Review `API_SPEC_PHASE1.md` and confirm it provides all the data you need for the Owner App screens (Pet List, Pet Detail, Vaccine List, Medical Records).
> 2. Confirm the project structure in `src/frontend` is set up (Vite/React) or ready to be set up.
> Report if any API data is missing for the UI."

## 3. Database Agent
**Task:** Verify Migrations
**Prompt:**
> "Database Agent, run a readiness check.
> 1. Verify that the current migration in `src/migrations/versions` matches the `DATA_MODEL_PHASE1.md`.
> 2. Confirm that the migration script handles all constraints (Foreign Keys with CASCADE, Unique constraints, Indexes) correctly.
> Report if the migration needs adjustment."

## 4. QA Agent
**Task:** Test Planning Readiness
**Prompt:**
> "QA Agent, run a readiness check.
> 1. Review `PHASE1_FEATURES.md` and `API_SPEC_PHASE1.md`.
> 2. Confirm you have enough information to create a Test Plan for the Backend API and basic Frontend flows.
> Report if any acceptance criteria are vague."
