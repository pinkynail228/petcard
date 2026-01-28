# PetCard Phase 1: API Specification

## Authentication (Implemented)
Based on `src/backend/routes/auth.py` (assumed based on file existence, need to verify exact paths).

- `POST /auth/telegram-login`: Login/Register with Telegram data.

## Pet Management (To Be Implemented)
- `GET /pets`: List all pets for current user.
- `POST /pets`: Create a new pet.
- `GET /pets/{id}`: Get pet details.
- `PUT /pets/{id}`: Update pet details.
- `DELETE /pets/{id}`: Delete pet.

## Vaccine Management (To Be Implemented)
- `GET /pets/{pet_id}/vaccines`: List vaccines.
- `POST /pets/{pet_id}/vaccines`: Add vaccine.
- `PUT /vaccines/{id}`: Update vaccine.
- `DELETE /vaccines/{id}`: Delete vaccine.

## Medical Records (To Be Implemented)
- `GET /pets/{pet_id}/records`: List records.
- `POST /pets/{pet_id}/records`: Add record.
- `PUT /records/{id}`: Update record.
- `DELETE /records/{id}`: Delete record.

## Clinic Connection (To Be Implemented)
- `POST /clinic/validate`: Validate code and link pet.
- `GET /pets/{pet_id}/clinic`: Get linked clinic info.

## Telegram Bot (To Be Implemented)
- `POST /telegram/webhook`: Webhook handler.
