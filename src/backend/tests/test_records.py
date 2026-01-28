import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_record(async_client: AsyncClient, test_user_token):
    # 1. Create Pet
    pet_res = await async_client.post(
        "/pets/",
        json={"name": "SickPet", "species": "Dog"},
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    pet_id = pet_res.json()["id"]

    # 2. Add Record
    payload = {
        "record_type": "Visit",
        "record_date": "2023-01-01",
        "notes": "Coughing",
        "vet_name": "Dr. Smith",
        "clinic_name": "Happy Vet"
    }
    response = await async_client.post(
        f"/pets/{pet_id}/records",
        json=payload,
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["record_type"] == "Visit"
    assert data["pet_id"] == pet_id
    assert data["vet_name"] == "Dr. Smith"

@pytest.mark.asyncio
async def test_get_records(async_client: AsyncClient, test_user_token):
    # Setup
    pet_res = await async_client.post(
        "/pets/",
        json={"name": "SickPet2", "species": "Cat"},
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    pet_id = pet_res.json()["id"]
    await async_client.post(
        f"/pets/{pet_id}/records",
        json={"record_type": "Lab", "record_date": "2023-02-01"},
        headers={"Authorization": f"Bearer {test_user_token}"}
    )

    # GET
    response = await async_client.get(
        f"/pets/{pet_id}/records",
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["record_type"] == "Lab"

@pytest.mark.asyncio
async def test_delete_record(async_client: AsyncClient, test_user_token):
    # Setup
    pet_res = await async_client.post("/pets/", json={"name": "SickPet3", "species": "Dog"}, headers={"Authorization": f"Bearer {test_user_token}"})
    pet_id = pet_res.json()["id"]
    rec_res = await async_client.post(f"/pets/{pet_id}/records", json={"record_type": "Surgery", "record_date": "2023-03-01"}, headers={"Authorization": f"Bearer {test_user_token}"})
    rec_id = rec_res.json()["id"]

    # Delete
    response = await async_client.delete(
        f"/pets/{pet_id}/records/{rec_id}",
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Record deleted"

    # Verify Gone
    get_res = await async_client.get(f"/pets/{pet_id}/records", headers={"Authorization": f"Bearer {test_user_token}"})
    current_ids = [r["id"] for r in get_res.json()]
    assert rec_id not in current_ids
