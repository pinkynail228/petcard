# PetCard Phase 1 - Test Plan

## 1. Overview
This document outlines the testing strategy for the PetCard Phase 1 MVP. The focus is on verifying core functionality (CRUD operations) for the Owner App and ensuring the API contract is respected.

## 2. Scope
- **Backend**: FastAPI endpoints for Auth, Pets, Vaccines, Medical Records, and Clinic Connection.
- **Frontend**: React Mini App critical user flows (Login, View, Add, Edit).
- **Out of Scope**: Third-party integration (e.g., actual Telegram API behavior), performance testing, security penetration testing.

## 3. Assumptions (Addressing Ambiguities)
1.  **Attachments**: The API expects a URL string for `attachment_url`. File hosting is external (e.g., user pastes a link to Google Drive/Dropbox). Testing will use dummy URLs.
2.  **Vaccine Status**: The system accepts raw strings: `active`, `due_soon`, `overdue`, `completed`. Frontend logic handles color coding.
3.  **Clinic Connection**: Testing will look for a 200 OK on valid codes and 404 on invalid codes.

## 4. Backend Test Cases (API)

### Authentication
| ID | Test Case | Endpoint | Expected Result |
| :--- | :--- | :--- | :--- |
| API-01 | Register new user | `POST /auth/register` | 200 OK, returns `access_token` |
| API-02 | Login existing user | `POST /auth/login` | 200 OK, returns `access_token` |
| API-03 | Login non-existent user | `POST /auth/login` | 404 Not Found |

### Pets
| ID | Test Case | Endpoint | Expected Result |
| :--- | :--- | :--- | :--- |
| API-04 | Create Pet | `POST /pets/` | 200 OK, returns Pet object with ID |
| API-05 | List Pets | `GET /pets/` | 200 OK, list contains created pet |
| API-06 | Get Pet Details | `GET /pets/{id}` | 200 OK, matches input data |
| API-07 | Update Pet | `PUT /pets/{id}` | 200 OK, fields updated |
| API-08 | Delete Pet | `DELETE /pets/{id}` | 200 OK, pet removed from list |
| API-09 | Access another user's pet | `GET /pets/{other_id}` | 403 Forbidden (if enforced) or 404 |

### Vaccines
| ID | Test Case | Endpoint | Expected Result |
| :--- | :--- | :--- | :--- |
| API-10 | Add Vaccine | `POST /pets/{id}/vaccines` | 200 OK, returns Vaccine object |
| API-11 | List Vaccines | `GET /pets/{id}/vaccines` | 200 OK, list includes new vaccine |
| API-12 | Update status | `PUT /pets/{id}/vaccines/{id}` | 200 OK, status changes |

### Medical Records
| ID | Test Case | Endpoint | Expected Result |
| :--- | :--- | :--- | :--- |
| API-13 | Add Record (Visit) | `POST /pets/{id}/records` | 200 OK, type=`visit` |
| API-14 | Add Record (with URL) | `POST /pets/{id}/records` | 200 OK, `attachment_url` saved |

### Clinic Connection
| ID | Test Case | Endpoint | Expected Result |
| :--- | :--- | :--- | :--- |
| API-15 | Connect valid code | `POST /clinic-codes/validate` | 200 OK, returns Clinic info |
| API-16 | Connect invalid code | `POST /clinic-codes/validate` | 400/404 Error |

## 5. Frontend Test Cases (User Flows)

### Flow 1: First Time Experience
1.  **Open App**: Verify Login Screen appears (or auto-login if Telegram WebApp).
2.  **Login**: Use Dev Login or Telegram Auth. Verify redirection to Home.
3.  **Empty State**: Verify Home shows "No pets added" prompt.

### Flow 2: Pet Lifecycle
1.  **Add Pet**: Click "+ Add Pet". Fill Name, Species, Breed. Submit.
2.  **Verify List**: Verify new pet appears on Home Screen with correct photo/icon.
3.  **View Profile**: Click pet card. Verify transition to default "Vaccines" tab.
4.  **Edit Pet**: Click "Edit". Change weight: Verify change on Profile.
5.  **Delete Pet**: Click "Delete". Confirm dialog. Verify return to Home and pet is gone.

### Flow 3: Health Management
1.  **Add Vaccine**: On Profile -> Vaccines tab, click "+ Add". Enter "Rabies".
2.  **Verify**: New vaccine appears in list with "Active" (green) indicator.
3.  **Add Record**: Switch to "Medical Records" tab. Click "+ Add". Enter "Checkup".
4.  **Verify**: Record appears in chronological list.

## 6. Execution Strategy
- **Manual QA**: Execute Frontend User Flows on local environment (`localhost:5173`).
- **Automated API**: Run `pytest` if available, or manual Curl/Postman tests against `localhost:8000`.
- **Reporting**: Log pass/fail status for each ID in `TEST_EXECUTION.md`.
