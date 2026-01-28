import pytest
import os
import asyncio
from typing import AsyncGenerator, Generator
from httpx import AsyncClient, ASGITransport
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

# Set test database URL
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from src.backend.main import app
from src.backend.database import get_db, Base

# Create a test engine for SQLite
# check_same_thread=False is needed for SQLite with fastAPI async
TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool, 
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function")
def db_session() -> Generator[Session, None, None]:
    """
    Creates a fresh database session for a test.
    Rolls back transaction after test is complete.
    """
    # Create tables
    Base.metadata.create_all(bind=test_engine)
    
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        # Drop tables after test
        Base.metadata.drop_all(bind=test_engine)

@pytest.fixture(scope="function")
def override_get_db(db_session: Session):
    def _override_get_db():
        try:
            yield db_session
        finally:
            pass
    return _override_get_db

@pytest.fixture(scope="function")
async def async_client(override_get_db) -> AsyncGenerator[AsyncClient, None]:
    """
    Creates an AsyncClient with database dependency overridden.
    """
    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client
    
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
async def test_user_token(async_client):
    """
    Registers a test user and returns an access token.
    """
    response = await async_client.post(
        "/auth/register",
        json={"telegram_id": "12345", "first_name": "Test", "last_name": "User"}
    )
    assert response.status_code == 200
    return response.json()["access_token"]
