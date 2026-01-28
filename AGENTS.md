# PetCard Agents Instructions

## Project Context
Read the `PROJECT_FOUNDATION.md` in the root directory FIRST. It contains the complete vision, architecture, and MVP scope.

## Phases of Development
- **Phase 1 (Weeks 1-4):** Owner-only app (this is what we're building NOW)
  - Pet management
  - Vaccine tracking
  - Medical records
  - Simple Telegram bot
  - NO clinic dashboard, NO appointments, NO AI in Phase 1

- **Phase 2 (Weeks 5-8):** Clinic features (future)
- **Phase 3 (Weeks 9+):** Monetization (future)

## Tech Stack (Phase 1)
- Backend: FastAPI (Python)
- Frontend: React (Telegram Mini App)
- Database: PostgreSQL
- Bot: python-telegram-bot
- Hosting: VPS (30GB SSD, 4CPU/4RAM)

## Code Style & Standards
- Python: PEP 8 compliant
- React: Functional components, hooks
- Database: Alembic migrations
- Tests: pytest for backend, Jest for frontend
- Commits: Clear, descriptive messages

## Before You Start Coding
1. Read `PROJECT_FOUNDATION.md` completely
2. Read `PHASE1_FEATURES.md` for detailed feature list
3. Read `DATA_MODEL_PHASE1.md` for database schema
4. Read `API_SPEC_PHASE1.md` for endpoint specifications
5. Ask clarifying questions in comments BEFORE implementing

## Important Constraints
- MVP Phase 1 is OWNER-ONLY (no clinic dashboard)
- All features FREE (no payments, no subscriptions)
- Simple manual clinic connection (just a code)
- No AI recommendations in Phase 1
- No appointment booking in Phase 1
- Maximum simplicity and MVP focus

## Agent Roles (How Multiple Agents Coordinate)

### 0. Coordinator Agent (Antigravity)
- **Role**: Architect & Project Manager.
- **Responsibilities**:
  - Creates Implementation Plans.
  - Defines Data Models and API Specs.
  - Verifies work of other agents.
  - Updates documentation.
- **STRICT RULES**:
  - ❌ **DO NOT WRITE IMPLEMENTATION CODE**.
  - ❌ **DO NOT FIX BUGS DIRECTLY**.
  - ❌ **DO NOT EDIT SOURCE FILES** (except docs/config).
  - Must delegate all coding tasks to Backend/Frontend/Database agents.
  - Can only write documentation, plans, and configuration files.

### 1. Backend Developer Agent
- Implements FastAPI endpoints
- Creates database models
- Handles Telegram webhook
- Writes unit tests

### 2. Frontend Developer Agent
- Builds React Mini App
- Handles Telegram Mini App integration
- Creates UI screens
- Tests components

### 3. Database Architect Agent
- Designs schema
- Creates Alembic migrations
- Sets up indexes and constraints
- Ensures data integrity

### 4. QA / Test Agent
- Writes unit tests
- Writes integration tests
- Verifies API contracts
- Tests database migrations

## Workflow
1. Backend Dev creates endpoints + models
2. Database Architect creates migrations
3. Frontend Dev builds UI
4. QA writes tests
5. Jules (in Phase 2) will run tests and fix bugs

## If You Get Stuck
- Reference PROJECT_FOUNDATION.md
- Check PHASE1_FEATURES.md for requirements
- Look at API_SPEC_PHASE1.md for endpoint details
- Add comments to implementation plans for clarification
