# PetCard Phase 1: Data Model

Based on `src/backend/models.py`.

## Core Entities

### Users
- **Table**: `users`
- **Purpose**: Stores pet owner information (telegram ID based).
- **Columns**:
  - `id`: Integer (PK)
  - `telegram_id`: String (Unique, Index)
  - `phone`: String (Optional)
  - `email`: String (Optional)
  - `first_name`: String
  - `last_name`: String
  - `username`: String (added in schema, not in model? Check code)
  - `photo_url`: String
  - `created_at`: DateTime
  - `updated_at`: DateTime

### Pets
- **Table**: `pets`
- **Purpose**: Stores pet profiles.
- **Columns**:
  - `id`: Integer (PK)
  - `owner_id`: Integer (FK -> users.id, CASCADE)
  - `name`: String
  - `species`: String
  - `breed`: String
  - `dob`: Date
  - `weight`: Float
  - `microchip_id`: String
  - `photo_url`: String
  - `created_at`: DateTime
  - `updated_at`: DateTime

### Vaccines
- **Table**: `vaccines`
- **Purpose**: helper for tracking vaccinations.
- **Columns**:
  - `id`: Integer (PK)
  - `pet_id`: Integer (FK -> pets.id, CASCADE)
  - `vaccine_name`: String
  - `date_administered`: Date
  - `next_due_date`: Date
  - `clinic_name`: String
  - `vet_name`: String
  - `notes`: Text
  - `status`: String (active, expired, overdue)
  - `created_at`: DateTime
  - `updated_at`: DateTime

### Medical Records
- **Table**: `medical_records`
- **Purpose**: General medical history (visits, labs, etc).
- **Columns**:
  - `id`: Integer (PK)
  - `pet_id`: Integer (FK -> pets.id, CASCADE)
  - `record_type`: String (Visit, Lab, Prescription, Surgery)
  - `record_date`: Date
  - `clinic_name`: String
  - `vet_name`: String
  - `notes`: Text
  - `attachments`: String (URL)
  - `created_at`: DateTime
  - `updated_at`: DateTime

### Clinic Codes (Manual Connection)
- **Table**: `clinic_codes`
- **Purpose**: Allows owners to manually link a pet to a clinic.
- **Columns**:
  - `id`: Integer (PK)
  - `pet_id`: Integer (FK -> pets.id, CASCADE, Unique)
  - `code`: String (Unique, Index)
  - `clinic_name`: String
  - `clinic_phone`: String
  - `created_at`: DateTime

### Telegram Notifications
- **Table**: `telegram_notifications`
- **Purpose**: Logs sent notifications.
- **Columns**:
  - `id`: Integer (PK)
  - `user_id`: Integer (FK -> users.id, CASCADE)
  - `message`: Text
  - `notification_type`: String
  - `read`: Boolean
  - `created_at`: DateTime
