import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_pet(async_client: AsyncClient, test_user_token):
    response = await async_client.post(
        "/pets/",
        json={"name": "Buddy", "species": "Dog", "breed": "Golden Retriever"},
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Buddy"
    assert "id" in data

@pytest.mark.asyncio
async def test_get_pets(async_client: AsyncClient, test_user_token):
    # Create a pet first
    await async_client.post(
        "/pets/",
        json={"name": "Buddy", "species": "Dog"},
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    
    response = await async_client.get(
        "/pets/",
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["name"] == "Buddy"

@pytest.mark.asyncio
async def test_add_vaccine(async_client: AsyncClient, test_user_token):
    # Create pet
    pet_res = await async_client.post(
        "/pets/",
        json={"name": "Kitty", "species": "Cat"},
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    pet_id = pet_res.json()["id"]
    
    # Add vaccine
    response = await async_client.post(
        f"/pets/{pet_id}/vaccines",
        json={"vaccine_name": "Rabies", "date_administered": "2023-01-01"},
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["vaccine_name"] == "Rabies"
    assert data["pet_id"] == pet_id

@pytest.mark.asyncio
async def test_add_medical_record(async_client: AsyncClient, test_user_token):
    # Create pet
    pet_res = await async_client.post(
        "/pets/",
        json={"name": "Kitty", "species": "Cat"},
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    pet_id = pet_res.json()["id"]
    
    # Add record
    response = await async_client.post(
        f"/pets/{pet_id}/records",
        json={"record_type": "Visit", "record_date": "2023-01-01", "notes": "Checkup"},
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["record_type"] == "Visit"
    assert data["pet_id"] == pet_id
