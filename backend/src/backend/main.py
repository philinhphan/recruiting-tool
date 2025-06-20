"""Main request handler"""

from enum import Enum
from logging import getLogger, basicConfig
from uuid import UUID
from typing import List

from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from http import HTTPStatus

import uvicorn

from backend.conf import DBConfig, init_conf
from backend.models import Personality, User, UserBase
from backend.database import DatabaseConnector, FilesCRUD, UserCRUD

basicConfig()
logger = getLogger(__name__)


class OpenAPITags(Enum):
    USER = "User"
    DASHBOARD = "Dashboard"


ROOT_PATH = "/api/v1"

# configuration
init_conf()
dbconf = DBConfig()

# main runner elements
app = FastAPI(
    root_path=ROOT_PATH,
    swagger_ui_parameters={"syntaxHighlight": {"theme": "obsidian"}},
)

# database connection
database = DatabaseConnector(dbconf)
userCRUD = UserCRUD(database)
filesCRUD = FilesCRUD(database)


@app.post("/user", tags=[OpenAPITags.USER], response_model=User, status_code=HTTPStatus.OK)
def create_user(user: UserBase) -> User:
    return userCRUD.create(user)


@app.get("/user/{uid}", tags=[OpenAPITags.USER, OpenAPITags.DASHBOARD], response_model=User, status_code=HTTPStatus.OK)
def get_user_by_id(uid: UUID) -> User:
    return userCRUD.get(uid)


@app.patch("/user/{uid}", tags=[OpenAPITags.USER], response_model=User, status_code=HTTPStatus.OK)
def update_user(uid: UUID, data: Personality) -> User:
    return userCRUD.update_personality(uid, data)


@app.post("/user/{uid}/file", tags=[OpenAPITags.USER], response_model=UUID, status_code=HTTPStatus.OK)
def upload(uid: UUID, file: UploadFile) -> UUID:
    _ = userCRUD.get(uid)
    filename = file.filename if file.filename else "cv.pdf"
    fid = filesCRUD.create(filename, file.file.read())
    userCRUD.update_file_id(uid, fid)
    return uid


@app.get("/user/{uid}/file", tags=[OpenAPITags.USER, OpenAPITags.DASHBOARD], status_code=HTTPStatus.OK)
def download(uid: UUID) -> StreamingResponse:
    user = userCRUD.get(uid)
    if not user.file_id:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="No cv found")
    content = filesCRUD.get(user.file_id)
    return StreamingResponse(
        content, media_type="application/pdf", headers={"Content-Disposition": f"filename={content.filename}"}
    )


@app.get("/user", tags=[OpenAPITags.DASHBOARD], response_model=List[User], status_code=HTTPStatus.OK)
def get_all_user() -> List[User]:
    return userCRUD.get_all()


def start():
    """Launched with `poetry run start` at root level"""
    logger.info("Lauched")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
