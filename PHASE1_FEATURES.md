# PetCard Phase 1: MVP Features

## Core Features (Owner App Only)

### 1. Authentication
- [x] Telegram ID-based registration
- [x] Login with Telegram ID
- [x] Simple session management
- [ ] NOT required: Email, password, 2FA

### 2. Pet Management
- [x] Add pet (name, breed, DOB, photo)
- [x] Edit pet info
- [x] List all pets
- [x] Delete pet
- [x] Simple pet profile view

### 3. Vaccine Management
- [x] Add vaccine record (date, name, status)
- [x] Edit vaccine record
- [x] Delete vaccine
- [x] List vaccines for pet
- [x] Mark vaccine as "completed", "upcoming", "overdue"
- [ ] NOT required: Auto-calculation of next vaccine date

### 4. Medical Records
- [x] Add medical record (type: visit, lab, prescription, surgery)
- [x] Add notes/comments
- [x] Attach file (photo of certificate, scan)
- [x] Edit record
- [x] Delete record
- [x] View chronological timeline
- [ ] NOT required: Automatic parsing of documents

### 5. Clinic Connection (Manual)
- [x] Generate unique clinic code (for pet)
- [x] Owner enters clinic code to link pet
- [x] View linked clinic name
- [x] Store clinic reference in database
- [ ] NOT required: Clinic dashboard, auto-sync, QR codes

### 6. Telegram Bot (Optional/Phase 1)
- [x] Send welcome message
- [x] Send manual notifications (owner can trigger)
- [x] Optional: Simple reminder notifications
- [ ] NOT required: Automated reminders, interactive buttons

### 7. Telegram Mini App Integration
- [x] Embed React app in Telegram
- [x] Authentication via Telegram
- [x] Navigation between screens
- [x] Real-time API calls
- [ ] NOT required: Offline support, caching

## Database & Backend Requirements
- PostgreSQL database with migrations
- API endpoints for all features
- Basic error handling
- Input validation

## Testing (Phase 1)
- Unit tests for backend endpoints
- Unit tests for database models
- Integration tests for API workflows
- Frontend component tests (basic)

## NOT in Phase 1 (Phase 2+)
- ❌ Clinic admin dashboard
- ❌ Clinic user accounts
- ❌ Appointment booking
- ❌ AI recommendations
- ❌ Payments / subscriptions
- ❌ SMS notifications
- ❌ Email notifications
- ❌ Advanced analytics
- ❌ Multi-language support
