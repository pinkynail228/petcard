import requests
import sys

BASE_URL = "http://localhost:8000"
AUTH_URL = f"{BASE_URL}/auth"
PETS_URL = f"{BASE_URL}/pets"

def log(msg, status="INFO"):
    print(f"[{status}] {msg}")

def test_api():
    session = requests.Session()
    
    # 1. API-01: Register
    log("Testing API-01: Register new user")
    user_data = {
        "telegram_id": "99999",
        "first_name": "Test",
        "last_name": "User",
        "username": "testuser",
        "photo_url": "http://example.com/photo.jpg"
    }
    # Try login first to see if user exists, if so, we skip register or handle it
    # But strictly following plan, let's try register. 
    # Note: Backend 'register' might duplicate if not handled, but 'login' usually handles both seeking.
    # Let's try the login endpoint which usually upserts in this MVP logic or use register if distinct.
    # Looking at previous file views, /auth/login and /auth/register exist.
    
    # Try Register
    resp = session.post(f"{AUTH_URL}/register", json=user_data)
    if resp.status_code == 200:
        token = resp.json().get("access_token")
        log(f"Register Success. Token: {token[:10]}...", "PASS")
    elif resp.status_code == 400: # Maybe already exists
        log("User might already exist, trying login", "WARN")
        resp = session.post(f"{AUTH_URL}/login", json=user_data)
        if resp.status_code == 200:
            token = resp.json().get("access_token")
            log(f"Login Success. Token: {token[:10]}...", "PASS")
        else:
             log(f"Login Failed: {resp.text}", "FAIL")
             return
    else:
        log(f"Register Failed: {resp.text}", "FAIL")
        return

    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. API-04: Create Pet
    log("Testing API-04: Create Pet")
    pet_data = {
        "name": "Buddy",
        "species": "dog",
        "breed": "Golden Retriever",
        "dob": "2020-01-01",
        "weight": 25.5,
        "photo_url": "http://example.com/buddy.jpg"
    }
    resp = session.post(PETS_URL, json=pet_data, headers=headers)
    if resp.status_code == 200:
        pet = resp.json()
        pet_id = pet['id']
        log(f"Create Pet Success. ID: {pet_id}", "PASS")
    else:
        log(f"Create Pet Failed: {resp.text}", "FAIL")
        return

    # 3. API-05: List Pets
    log("Testing API-05: List Pets")
    resp = session.get(PETS_URL, headers=headers)
    if resp.status_code == 200:
        pets = resp.json()
        if any(p['id'] == pet_id for p in pets):
            log(f"List Pets Success. Found pet {pet_id}", "PASS")
        else:
             log("List Pets Failed. Pet not found in list", "FAIL")
    else:
        log(f"List Pets Failed: {resp.text}", "FAIL")

    # 4. API-10: Add Vaccine
    log("Testing API-10: Add Vaccine")
    vaccine_data = {
        "vaccine_name": "Rabies",
        "date_administered": "2023-01-01",
        "next_due_date": "2024-01-01",
        "status": "active",
        "notes": "First shot"
    }
    # Note: Endpoint in API Spec vs Code might differ. Checking code... 
    # verify path: /pets/{id}/vaccines
    resp = session.post(f"{PETS_URL}/{pet_id}/vaccines", json=vaccine_data, headers=headers)
    if resp.status_code == 200:
         log("Add Vaccine Success", "PASS")
    else:
         log(f"Add Vaccine Failed: {resp.text}", "FAIL")

    # 5. API-13: Add Medical Record
    log("Testing API-13: Add Medical Record")
    record_data = {
        "record_date": "2023-06-01",
        "record_type": "visit",
        "notes": "Annual checkup",
        "vet_name": "Dr. Smith"
    }
    resp = session.post(f"{PETS_URL}/{pet_id}/records", json=record_data, headers=headers)
    if resp.status_code == 200:
         log("Add Record Success", "PASS")
    else:
         log(f"Add Record Failed: {resp.text}", "FAIL")

    # 6. API-08: Delete Pet
    log("Testing API-08: Delete Pet")
    resp = session.delete(f"{PETS_URL}/{pet_id}", headers=headers)
    if resp.status_code == 200:
         log("Delete Pet Success", "PASS")
    else:
         log(f"Delete Pet Failed: {resp.text}", "FAIL")

if __name__ == "__main__":
    try:
        test_api()
    except Exception as e:
        log(f"Exception: {e}", "FAIL")
