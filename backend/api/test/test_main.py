from httpx import AsyncClient
import pytest
from ..main import app


@pytest.mark.asyncio
async def test_read_main():
    async with AsyncClient(
        app=app, base_url="http://localhost:8000/api/Parameter/TahunKegiatan/GetAll"
    ) as ac:
        response = await ac.get("/")
        assert response.status_code == 200
