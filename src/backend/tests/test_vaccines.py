import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_vaccine(async_client: AsyncClient, test_user_token):
    # 1. Create Pet
    pet_res = await async_client.post(
        "/pets/",
        json={"name": "VaxPet", "species": "Dog"},
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    assert pet_res.status_code == 200
    pet_id = pet_res.json()["id"]

    # 2. Add Vaccine
    payload = {
        "vaccine_name": "Rabies",
        "date_administered": "2023-01-01",
        "next_due_date": "2024-01-01",
        "notes": "First dose"
    }
    response = await async_client.post(
        f"/pets/{pet_id}/vaccines",
        json=payload,
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["vaccine_name"] == "Rabies"
    assert data["pet_id"] == pet_id
    assert data["notes"] == "First dose"

@pytest.mark.asyncio
async def test_get_vaccines(async_client: AsyncClient, test_user_token):
    # Setup: Pet + Vaccine
    pet_res = await async_client.post(
        "/pets/",
        json={"name": "VaxPet2", "species": "Cat"},
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    pet_id = pet_res.json()["id"]
    await async_client.post(
        f"/pets/{pet_id}/vaccines",
        json={"vaccine_name": "FVRCP", "date_administered": "2023-05-20"},
        headers={"Authorization": f"Bearer {test_user_token}"}
    )

    # Test GET
    response = await async_client.get(
        f"/pets/{pet_id}/vaccines",
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["vaccine_name"] == "FVRCP"

@pytest.mark.asyncio
async def test_update_vaccine(async_client: AsyncClient, test_user_token):
    # Setup
    pet_res = await async_client.post("/pets/", json={"name": "VaxPet3", "species": "Dog"}, headers={"Authorization": f"Bearer {test_user_token}"})
    pet_id = pet_res.json()["id"]
    vax_res = await async_client.post(f"/pets/{pet_id}/vaccines", json={"vaccine_name": "Parvo", "date_administered": "2023-01-01"}, headers={"Authorization": f"Bearer {test_user_token}"})
    vax_id = vax_res.json()["id"]

    # Update
    response = await async_client.put(
        f"/pets/{pet_id}/vaccines/{vax_id}",
        json={"vaccine_name": "Parvovirus Modified", "status": "expired"},
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["vaccine_name"] == "Parvovirus Modified"
    assert data["status"] == "expired"

@pytest.mark.asyncio
async def test_delete_vaccine(async_client: AsyncClient, test_user_token):
    # Setup
    pet_res = await async_client.post("/pets/", json={"name": "VaxPet4", "species": "Dog"}, headers={"Authorization": f"Bearer {test_user_token}"})
    pet_id = pet_res.json()["id"]
    vax_res = await async_client.post(f"/pets/{pet_id}/vaccines", json={"vaccine_name": "Distemper", "date_administered": "2023-01-01"}, headers={"Authorization": f"Bearer {test_user_token}"})
    vax_id = vax_res.json()["id"]

    # Delete
    response = await async_client.delete(
        f"/pets/{pet_id}/vaccines/{vax_id}",
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Vaccine deleted"

    # Verify Gone
    get_res = await async_client.get(f"/pets/{pet_id}/vaccines", headers={"Authorization": f"Bearer {test_user_token}"})
    current_ids = [v["id"] for v in get_res.json()]
    assert vax_id not in current_ids
