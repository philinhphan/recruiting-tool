"""Main request handler"""

from enum import Enum
from logging import getLogger, basicConfig
from uuid import UUID
from typing import List

from fastapi import FastAPI, HTTPException, Request, Depends
from http import HTTPStatus

import uvicorn

from backend.conf import DBConfig, AuthConfig, init_conf
from backend.models import User, UserBase
from backend.database import DatabaseConnector

basicConfig()
logger = getLogger(__name__)


class OpenAPITags(Enum):
    USER = "User"
    ADMIN = "Admin"


ROOT_PATH = "/api/v1"

# configuration
init_conf()
dbconf = DBConfig()
authconf = AuthConfig()

# main runner elements
app = FastAPI(
    root_path=ROOT_PATH,
    swagger_ui_parameters={"syntaxHighlight": {"theme": "obsidian"}},
)
# database connection
database = DatabaseConnector(dbconf)


async def get_users_crud(session: AsyncSession = Depends(database.get_async_session)) -> UserCRUD:
    return UserCRUD(session=session)  # type: ignore


async def get_clients_crud(session: AsyncSession = Depends(database.get_async_session)) -> ClientCRUD:
    return ClientCRUD(session=session)  # type: ignore


async def get_userclient_crud(session: AsyncSession = Depends(database.get_async_session)) -> UserClientConnCRUD:
    return UserClientConnCRUD(session=session)  # type: ignore


@app.get("/user/whoiam", tags=[OpenAPITags.USER], response_model=Session, status_code=HTTPStatus.OK)
async def who_i_am(req: Request) -> None:
    session = await get_user_by_session(authconf, req.cookies)
    if not session.identity:
        raise HTTPException(HTTPStatus.BAD_REQUEST, detail="Identity missing")
    return


@app.get("/user/info", tags=[OpenAPITags.USER], response_model=Session, status_code=HTTPStatus.OK)
async def get_user_info(req: Request) -> None:
    session = await get_user_by_session(authconf, req.cookies)
    if not session.identity:
        raise HTTPException(HTTPStatus.BAD_REQUEST, detail="Identity missing")


@app.post("/admin/user", tags=[OpenAPITags.ADMIN], response_model=UserRead, status_code=HTTPStatus.CREATED)
async def create_user(data: UserCreate, users: UserCRUD = Depends(get_users_crud)):
    user = await users.create(data=data)
    return user


@app.get("/admin/user/{user_id}", tags=[OpenAPITags.ADMIN], response_model=UserRead, status_code=HTTPStatus.OK)
async def get_user_by_uuid(user_id: UUID, users: UserCRUD = Depends(get_users_crud)):
    user = await users.get(user_id=user_id)
    return user


@app.get(
    "/admin/user/{user_id}/client",
    tags=[OpenAPITags.ADMIN],
    response_model=List[UUID],
    status_code=HTTPStatus.CREATED,
)
async def get_all_clients(
    user_id: UUID,
    conn: UserClientConnCRUD = Depends(get_userclient_crud),
):
    client_ids = await conn.get_all_client_ids_by_user(user_id)

    return client_ids


@app.post(
    "/admin/user/{user_id}/client/{client_id}",
    tags=[OpenAPITags.ADMIN],
    response_model=UUID,
    status_code=HTTPStatus.CREATED,
)
async def add_client_to_user(
    user_id: UUID,
    client_id: UUID,
    users: UserCRUD = Depends(get_users_crud),
    clients: ClientCRUD = Depends(get_clients_crud),
    conn: UserClientConnCRUD = Depends(get_userclient_crud),
):
    # check if user + client exist
    _ = await clients.get(client_id)
    _ = await users.get(user_id)

    client_ids = await conn.get_all_client_ids_by_user(user_id)
    if client_id in client_ids:
        raise HTTPException(HTTPStatus.CONFLICT, "already connected")

    client_uuid = await conn.add_connection(user_id, client_id)

    return client_uuid


def start():
    """Launched with `poetry run start` at root level"""
    logger.info("Lauched")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
