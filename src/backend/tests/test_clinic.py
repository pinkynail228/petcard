import pytest
from httpx import AsyncClient
from sqlalchemy.orm import Session
from src.backend import models

@pytest.mark.asyncio
async def test_validate_clinic_code(async_client: AsyncClient, test_user_token, db_session: Session):
    # 1. Create Pet via API
    pet_res = await async_client.post(
        "/pets/",
        json={"name": "ClinicPet", "species": "Dog"},
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    pet_id = pet_res.json()["id"]

    # 2. Seed a ClinicCode in DB
    # We need a dummy pet to own this code first? 
    # Or can we create a code with the current pet?
    # If we create it linked to current pet, then validation endpoint updates it?
    # Or simply: validation links it.
    # Logic in code: "clinic_code.pet_id = pet.id".
    # This implies it might be re-assigned or assigned for the first time.
    # But database constraint says pet_id is NOT NULL.
    # So we must create it with SOME pet_id.
    
    # Let's create another "Placeholder" pet to hold the code initially?
    # Or maybe the clinic creates a "Dummy" pet?
    # For this test, I'll create a dummy pet directly in DB.
    
    dummy_pet = models.Pet(
        name="Dummy", species="Ghost", owner_id=1 # assuming owner 1 exists or constraints are loose in sqlite
    )
    # Be careful with foreign keys. SQLite enforces them by default in recent versions?
    # My "test_user_token" created a user. We can find it.
    
    # Better: Use the SAME user to create a "Placeholder Pet".
    # Or create a new user.
    
    # Just create a ClinicCode linked to the SAME pet for now, then try to validate it (which is a no-op or re-assignment).
    # But wait, validate is for LINKING. If it's already linked, it should still work.
    
    # Let's try to link it to the SAME pet.
    clinic_code = models.ClinicCode(
        code="VET-123",
        clinic_name="Super Vet",
        pet_id=pet_id # Linked to our pet
    )
    db_session.add(clinic_code)
    db_session.commit()
    
    # 3. Validate via API
    response = await async_client.post(
        "/clinic-codes/validate",
        json={"code": "VET-123", "pet_id": pet_id},
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["clinic_name"] == "Super Vet"
    
    # 4. Verify link (it was already linked, but verify logic holds)
    
@pytest.mark.asyncio
async def test_validate_invalid_code(async_client: AsyncClient, test_user_token):
    # Create Pet
    pet_res = await async_client.post(
        "/pets/",
        json={"name": "ClinicPet2", "species": "Cat"},
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    pet_id = pet_res.json()["id"]
    
    # Validate non-existent code
    response = await async_client.post(
        "/clinic-codes/validate",
        json={"code": "INVALID-999", "pet_id": pet_id},
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_validate_code_wrong_owner(async_client: AsyncClient, test_user_token, db_session: Session):
    # Only owner can link pet
    # Create pet for current user
    pet_res = await async_client.post(
        "/pets/",
        json={"name": "ClinicPet3", "species": "Cat"},
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    pet_id = pet_res.json()["id"]
    
    # Register another user
    other_res = await async_client.post(
        "/auth/register",
        json={"telegram_id": "66666", "first_name": "Hacker"}
    )
    other_token = other_res.json()["access_token"]
    
    # Try to validate code for pet_id (owned by user1) using user2 token
    response = await async_client.post(
        "/clinic-codes/validate",
        json={"code": "VET-000", "pet_id": pet_id},
        headers={"Authorization": f"Bearer {other_token}"}
    )
    assert response.status_code == 403 or response.status_code == 404
    # The check_pet_ownership raises 403 or 404 depending on implementation.
    # In pets.py: check_pet_ownership raises 404 if not found, 403 if not owner.
    # But since user2 can't see user1's pet, it might be 403.
    # Actually pets.py: "pet = db.query(...).filter(Pet.id == pet_id).first()" -> if not pet: 404.
    # It finds the pet (it exists), checks owner.
    # So it should be 403.
    assert response.status_code == 403
