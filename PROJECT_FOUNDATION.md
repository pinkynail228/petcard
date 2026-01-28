PetCard — Digital Pet Health Passport
🎯 Project Vision
PetCard is a digital health passport for pets that connects pet owners with veterinary clinics through a unified Telegram Mini App ecosystem. It transforms pet healthcare from fragmented paper records into a seamless, intelligent digital experience.
Mission: Make pet health management accessible, transparent, and collaborative between owners and professionals.

📋 Project Principles & Philosophy
Core Principles
	•	Simplicity First
	•	UI/UX should be intuitive for non-tech pet owners
	•	Minimum friction to view/manage pet health records
	•	No unnecessary complexity in features or workflows
	•	Trust & Transparency
	•	All health data visible to owner (no hidden clinic records)
	•	Clear communication between owner and clinic
	•	Audit trail for all changes (who changed what, when)
	•	Integration, Not Replacement
	•	Works WITH existing clinic systems, not against them
	•	Clinics maintain their primary systems
	•	PetCard is the "bridge" between owner and clinic
	•	Smart, Not Magical
	•	AI recommendations based on actual data, not guesses
	•	Clear explanations for recommendations (why this vaccine now?)
	•	AI supports human decision-making, doesn't replace vet authority
	•	Data Ownership
	•	Owner owns their pet's data
	•	Easy export/portability (not vendor lock-in)
	•	GDPR/privacy-compliant from day 1

💡 What We're Building (High-Level)
PetCard = Three Interconnected Views
1. Owner View (Telegram Mini App)
Pet owners see and manage:
	•	Pet Profile: Basic info (name, breed, age, photo)
	•	Health Timeline: Medical visits, vaccinations, medications (text notes from clinic)
	•	Vaccination Schedule: Simple list of vaccines with dates and "Next Due" field
	•	Manual Clinic Connection: Link to clinic via unique code/QR (clinic doesn't auto-sync yet)
2. Clinic View (Minimal Admin)
MVP Scope: NOT included in first release.
	•	Clinics will manually share a unique code with owners
	•	Owners manually enter this code to "connect" to their clinic
	•	Phase 2 will add clinic dashboard for uploading records
3. System View (Telegram Bot)
Notifications:
	•	Manual Reminders: Owner can set custom reminder dates for vaccines
	•	Notifications: Simple text messages (vaccine due soon, manual notes from clinic)
	•	Optional messaging between owner and clinic (text-based, not automated yet)

🎬 User Journeys
Owner Journey: First Time Setup
	•	Owner opens Telegram Mini App
	•	Creates account (Telegram ID only)
	•	Adds first pet (name, breed, DOB, photo)
	•	Manually enters vaccination history (date, vaccine name)
	•	Sets up manual clinic connection (via clinic code)
	•	Optionally uploads photos of vaccination certificates
Owner Journey: Regular Use
	•	Owner receives Telegram reminder: "Bella's rabies vaccine is due in 5 days"
	•	Opens Mini App → Clinic's appointment calendar
	•	Selects available slot with Dr. Smith on Thursday
	•	Books appointment + adds note: "She's been limping on back leg"
	•	Gets confirmation in Telegram
	•	Day before appointment: automated reminder
	•	After visit: Clinic uploads visit note + prescriptions to PetCard
	•	Owner sees update in timeline, reads recommendations from Dr. Smith
Clinic Journey: Onboarding
	•	Clinic admin signs up → creates clinic account
	•	Adds clinic info (name, address, hours, staff)
	•	Creates user accounts for doctors/staff
	•	Gets unique QR code or referral link to share with clients
	•	Clients scan QR → connect their PetCard to clinic
	•	Clinic can now see client's pet in their patient list
	•	When doctor finishes visit: uploads visit notes, prescriptions, recommendations
	•	Client gets notification in Telegram + sees data in their PetCard

🗂️ Data Model (Conceptual)
Core Entities
Users (Pet Owners)
	•	ID, Telegram ID, Phone, Email
	•	Name, Avatar, Preferences
	•	List of Pets (one-to-many)
	•	Connected Clinics (many-to-many)
Pets
	•	ID, Owner ID, Name, Species, Breed, DOB, Weight, Photo
	•	Microchip ID (optional)
	•	Medical History (one-to-many with Medical Records)
	•	Connected Clinic (optional, many-to-one)
Medical Records
	•	ID, Pet ID, Clinic ID, Date, Type (Vaccination, Checkup, Lab Test, Prescription, Surgery)
	•	Vet Name, Visit Notes, Diagnoses, Prescriptions
	•	Attachments (scan of certificate, lab results)
	•	Visibility: Owner + Original Clinic only
Vaccinations
	•	ID, Pet ID, Vaccine Name, Date Administered, Next Due Date, Notes
	•	Status: Active, Expired, Due Soon, Overdue
Medical Records
	•	ID, Pet ID, Date, Type (Visit, Lab, Prescription, Surgery)
	•	Clinic Name (text, not required), Vet Name, Notes (text), Attachments (optional)
Clinic Codes (simple manual connection)
	•	ID, Code (e.g., "VET-ABC123"), Clinic Name, Clinic Phone
	•	(Used by owners to manually link their pet to clinic)

🔌 API Endpoints (MVP Scope)
MVP Phase 1: Owner-Only Endpoints
Authentication & User
	•	POST /auth/register — Register with Telegram ID + phone
	•	POST /auth/login — Login with Telegram ID
	•	GET /me — Get current user profile
Pets Management
	•	POST /pets — Add new pet (name, breed, DOB, photo)
	•	GET /pets — List owner's pets
	•	GET /pets/{id} — Get pet profile
	•	PUT /pets/{id} — Edit pet info
	•	DELETE /pets/{id} — Delete pet
Vaccines & Medical Records
	•	POST /pets/{id}/vaccines — Add vaccine record (date, name, notes)
	•	GET /pets/{id}/vaccines — List vaccines for pet
	•	PUT /pets/{id}/vaccines/{vaccine_id} — Edit vaccine record
	•	DELETE /pets/{id}/vaccines/{vaccine_id} — Delete vaccine
	•	POST /pets/{id}/records — Add medical record (visit, lab, etc)
	•	GET /pets/{id}/records — List medical records for pet
	•	PUT /pets/{id}/records/{record_id} — Edit record
	•	DELETE /pets/{id}/records/{record_id} — Delete record
Clinic Connection (Manual)
	•	POST /clinic-codes/validate — Validate clinic code and link pet
	•	GET /pets/{id}/clinic — Get linked clinic info for pet
Telegram Bot
	•	POST /telegram/webhook — Receive messages from Telegram Bot
	•	POST /telegram/notifications/send — Send notification to user

🎨 UI/UX Flows (Mini App Screens)
Owner App Screens
	•	Home Screen
	•	List of pets (with photos, next appointment, next vaccine due)
	•	Quick actions: + Add Pet, Book Appointment
	•	Latest notifications
	•	Pet Profile Screen
	•	Pet name, photo, breed, age, weight
	•	Connected clinic (if any)
	•	Tabs: Timeline | Vaccines | Appointments | Recommendations
	•	Timeline Screen (Medical History)
	•	Chronological list of visits, vaccines, prescriptions
	•	Each entry shows: date, type, clinic, vet name, brief notes
	•	Tap to expand → full details
	•	Vaccines Screen
	•	Table: Vaccine Name | Date Given | Next Due | Status
	•	Color coding: Green (active), Yellow (due soon), Red (overdue)
	•	Button: "Book appointment to renew"
	•	Appointments Screen
	•	List of past and upcoming appointments
	•	For upcoming: clinic name, date, time, vet name
	•	Button: Cancel or Reschedule
	•	Clinic Booking Screen
	•	Select clinic (if connected to multiple)
	•	Select doctor
	•	Calendar: available time slots (next 2 weeks)
	•	Form: reason for visit, symptoms, notes
	•	Confirmation
	•	Settings Screen
	•	Pet list management (edit, add, remove)
	•	Notification preferences (turn reminders on/off)
	•	Account settings (logout, delete account)
	•	Connected clinics list
Clinic Admin Dashboard Screens
	•	Dashboard
	•	Quick stats: Total patients, upcoming appointments, new records
	•	Recent activity feed
	•	Patient List
	•	Search/filter by pet name, owner name, breed
	•	Each row: Pet photo | Name | Breed | Owner | Last visit | Status
	•	Patient Detail
	•	Pet profile
	•	Medical timeline
	•	Upload new record (visit note, prescription, lab result)
	•	"Sync to Owner" button
	•	Appointments
	•	Calendar view
	•	Doctor availability
	•	Booked slots
	•	No-show tracking
	•	Analytics
	•	Vaccination coverage %
	•	Appointment no-shows
	•	Popular services
	•	Pet health trends by breed

🔗 Integrations (MVP Phase)
Telegram Bot Integration
	•	Bot sends notifications to owner's Telegram
	•	Owner can reply with quick actions (confirm appointment, yes/no to recommendation)
	•	Mini App is embedded in Telegram (native integration)
Clinic Onboarding
	•	QR code (unique per clinic) for owner to scan and connect
	•	Alternative: Search clinic by name/address, request connection, clinic approves
Payment (Future, not MVP)
	•	Telegram Stars (built-in Telegram payment)
	•	Owner can pay clinic directly through app
	•	Clinic subscription (Standard/Premium tiers)

📊 Business Model
MVP Phase 1: Free Only
	•	All features available for free during MVP
	•	NO subscriptions, NO payments in Phase 1
	•	Goal: Test product-market fit, gather feedback, build user base
Phase 2: B2C Subscriptions (Weeks 8+)
	•	Free Plan: Unlimited pets, basic features
	•	Pro Plan ($3.99/month): Export records, advanced features
	•	Monetized through Telegram Stars
Phase 3: B2B Clinic Subscriptions (Weeks 12+)
	•	Free tier for clinics (limited)
	•	Standard/Premium tiers once clinic dashboard is built

🚀 Development Phases
Phase 1: MVP Owner App (Weeks 1-4)
Goal: Owner can track pets and their medical records in Telegram Mini App
Features:
	•	Telegram authentication (Telegram ID)
	•	Add/edit pet profile (name, breed, DOB, photo)
	•	Add/edit vaccine records (date, vaccine name, notes)
	•	Add/edit medical records (visit notes, prescriptions, labs)
	•	View pet timeline (chronological list of all records)
	•	Simple Telegram bot notifications (optional reminders owner sets manually)
	•	Manual clinic connection via code (owner enters clinic code → links pet)
Out of Scope (Phase 1):
	•	No clinic dashboard
	•	No auto-sync from clinic
	•	No appointment booking
	•	No AI recommendations
	•	No payments
Tech Stack:
	•	Backend: FastAPI (Python)
	•	Frontend: React (Telegram Mini App)
	•	Database: PostgreSQL
	•	Hosting: VPS (30GB SSD, 4CPU/4RAM)
	•	Bot: python-telegram-bot library
Deliverables:
	•	Working Mini App on VPS
	•	API endpoints for pets, vaccines, records
	•	Telegram Bot webhook
	•	Database schema (Users, Pets, Vaccines, Medical Records, Clinic Codes)
Phase 2: Clinic Dashboard (Weeks 5-8)
Goal: Clinics can upload records to owner's PetCard
New Features:
	•	Clinic registration (simple, free)
	•	Clinic dashboard (React web app)
	•	Generate unique clinic code
	•	Search for connected pets (by owner phone or pet name)
	•	Upload medical records to pet (visit notes, prescriptions, test results)
	•	Mark vaccines as "completed" for owner
	•	Simple message/notes to owner (future: messaging)
New Endpoints:
	•	Clinic auth & profile
	•	Search pets by clinic
	•	Upload records to pet
	•	View pets connected to clinic
Phase 3: Monetization + Features (Weeks 9+)
	•	Owner Pro tier ($3.99/month via Telegram Stars)
	•	Clinic premium tier ($199/month)
	•	Appointment calendar for clinics
	•	SMS notifications
	•	Advanced analytics
	•	Multi-language support

🛡️ Constraints & Guardrails
Data Privacy & Security
	•	All pet health data is private (owner-clinic only)
	•	GDPR compliant (data export, deletion rights)
	•	Encrypted storage for medical records
	•	No third-party tracking or data sales
Clinic Trust
	•	Clinics are not "forced" onto PetCard
	•	Only clinic staff can upload/modify medical records
	•	Owner must explicitly connect to clinic
	•	Clinic can disconnect anytime
Owner Experience
	•	No complex registration (Telegram ID is enough)
	•	No mandatory fields (MVP: just pet name + photo)
	•	Intuitive navigation (3 tabs max per screen)
	•	Fast load times (medical records should load in <2 sec)

📈 Success Metrics (North Star)
Owner Engagement
	•	DAU/MAU Ratio: 40%+ of monthly users open app weekly
	•	Pet Profile Completeness: 70%+ users have at least 2 pets added
	•	Vaccination Tracking: 50%+ of owners complete scheduled vaccines within 2 weeks of due date
Clinic Adoption
	•	Clinic Onboarding: <5 minutes from signup to first patient connected
	•	Patient Sync: Clinics upload medical records to owner within 24 hours of visit
	•	Repeat Usage: 70%+ of clinics use PetCard for 3+ pets/month
Business Metrics
	•	CAC (Customer Acquisition Cost): <$10 per owner, <$50 per clinic
	•	LTV (Lifetime Value): Owner LTV >$100, Clinic LTV >$2000
	•	Churn: <5% monthly churn for Pro owners, <10% for clinic subscribers

🎯 Phase 1 Non-Goals (What We're NOT Building)
	•	❌ Clinic admin dashboard (Phase 2)
	•	❌ Appointment booking system (Phase 2)
	•	❌ AI recommendations (Phase 3+)
	•	❌ Payments & subscriptions (Phase 2)
	•	❌ Auto-sync from clinic (Phase 2)
	•	❌ Telehealth (Phase 3+)
	•	❌ Pet insurance / pharmacy (Phase 3+)
	•	❌ Multiple language support (Phase 2+)
	•	❌ Native iOS/Android apps (Mini App sufficient)

🏗️ Architecture Overview (High-Level)
┌─────────────────────────────────────────────────────────┐│ PETCARD ECOSYSTEM (High-Level) │├─────────────────────────────────────────────────────────┤│ ││ TELEGRAM MINI APP (Owner) ││ ├─ Pet profiles & medical timeline ││ ├─ Vaccine schedule ││ ├─ AI recommendations ││ ├─ Appointment booking (if clinic connected) ││ └─ View updates from clinic ││ ↕ (API calls) ││ TELEGRAM BOT (Notifications) ││ ├─ Vaccine reminders ││ ├─ Appointment confirmations ││ └─ Clinic updates & alerts ││ ││ ↓ ││ ││ FASTAPI BACKEND (VPS) ││ ├─ User auth & pet management (owner) ││ ├─ Medical records & vaccines storage ││ ├─ Clinic auth & patient search (clinic) ││ ├─ Telegram bot webhooks ││ └─ (NO AI, NO appointments in Phase 1) ││ ││ ↓ ││ ││ POSTGRESQL DATABASE (VPS) ││ ├─ Users, Pets, Medical Records, Vaccines ││ ├─ Clinic Accounts, Clinic Codes ││ └─ (NO appointments, NO AI cache in Phase 1) ││ ││ ↓ ││ ││ CLINIC ADMIN DASHBOARD (React) ││ ├─ Patient management ││ ├─ Medical record uploads ││ ├─ Appointment calendar ││ └─ Analytics ││ ↕ (API calls) ││ ↓ ││ ││ GITHUB REPOSITORY ││ ├─ Source code (backend, frontend, migrations) ││ ├─ CI/CD pipeline (GitHub Actions) ││ ├─ Issues & PRs (from Antigravity & Jules) ││ └─ Deployment automation ││ │└─────────────────────────────────────────────────────────┘

📚 Reference Documents to Follow
Once this document is approved, we'll create:
	•	FEATURES_PHASE1.md — MVP feature list & requirements
	•	DATA_MODEL_PHASE1.md — Phase 1 database schema (Users, Pets, Vaccines, Records, Clinic Codes)
	•	API_SPEC_PHASE1.md — Phase 1 API endpoints (owner + Telegram bot only)
	•	UI_FLOWS_PHASE1.md — Phase 1 Mini App screens & flows
	•	AGENTS.md — Instructions for Antigravity agents (how to code Phase 1)
	•	DEPLOYMENT.md — VPS setup, database, running on 30GB/4CPU/4RAM
Phase 2+ docs: Will be created after Phase 1 MVP is live

✅ Approval & Next Steps
This document serves as:
	•	Foundation for all development decisions
	•	Reference for Antigravity agents (they read this first)
	•	Alignment document between strategy (Kontour 1) and execution (Kontour 2)
When approved:
	•	We move to creating FEATURES.md (what we build first)
	•	Define DATA_MODEL.md (how data flows)
	•	Write AGENTS.md (how Antigravity agents work)
	•	Start Kontour 2: Agents begin writing code

📋 Document Metadata
	•	Created: January 28, 2026
	•	Project: PetCard
	•	Version: 1.0 (MVP Foundation)
	•	Audience: Project team, Antigravity agents, stakeholders
	•	Status: Foundation (awaiting approval for next phase)
