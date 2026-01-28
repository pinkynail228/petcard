import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_user(async_client: AsyncClient):
    response = await async_client.post(
        "/auth/register",
        json={
            "telegram_id": "99999", 
            "first_name": "New", 
            "last_name": "Tester", 
            "username": "newtester",
            "photo_url": "http://example.com/photo.jpg"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_register_duplicate_user(async_client: AsyncClient):
    await async_client.post(
        "/auth/register",
        json={"telegram_id": "88888", "first_name": "Repeater"}
    )
    response = await async_client.post(
        "/auth/register",
        json={"telegram_id": "88888", "first_name": "Repeater"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "User already registered"

@pytest.mark.asyncio
async def test_login_user(async_client: AsyncClient):
    # Register first
    await async_client.post(
        "/auth/register",
        json={"telegram_id": "77777"}
    )
    
    # Login
    response = await async_client.post(
        "/auth/login",
        json={"telegram_id": "77777"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_login_invalid_user(async_client: AsyncClient):
    response = await async_client.post(
        "/auth/login",
        json={"telegram_id": "00000"}
    )
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_get_me(async_client: AsyncClient, test_user_token):
    response = await async_client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["telegram_id"] == "12345"
