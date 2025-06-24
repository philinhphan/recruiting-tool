"""Main request handler"""

from enum import Enum
from logging import getLogger, basicConfig
from uuid import UUID
from json import loads
from typing import List
import json

from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from http import HTTPStatus

import uvicorn

from backend.conf import DBConfig, AppConfig, init_conf
from backend.models import Jobs, OfferingRequest, Question, User, UserBase, UserUpdate
from backend.database import DatabaseConnector, FilesCRUD, UserCRUD
from backend.agent import Agent, Prompts, get_user_answers, init_job_database, understand_personality

basicConfig()
logger = getLogger(__name__)


class OpenAPITags(Enum):
    USER = "User"
    DASHBOARD = "Dashboard"


ROOT_PATH = "/api/v1"

# configuration
init_conf()
dbconf = DBConfig()
appconf = AppConfig()

# main runner elements
app = FastAPI(
    root_path=ROOT_PATH,
    swagger_ui_parameters={"syntaxHighlight": {"theme": "obsidian"}},
)

# database connection
database = DatabaseConnector(dbconf)
userCRUD = UserCRUD(database)
filesCRUD = FilesCRUD(database)

# agent
agent = Agent(appconf)
# JOB_DB = init_job_database(agent, "./open-positions.json")
with open("./open-positions.json", "r") as f:
    job_db = f.read()


@app.post("/user", tags=[OpenAPITags.USER], response_model=User, status_code=HTTPStatus.OK)
def create_user(user: UserBase) -> User:
    return userCRUD.create(user)


@app.get("/user/{uid}", tags=[OpenAPITags.USER, OpenAPITags.DASHBOARD], response_model=User, status_code=HTTPStatus.OK)
def get_user_by_id(uid: UUID) -> User:
    return userCRUD.get(uid)


@app.patch("/user/{uid}", tags=[OpenAPITags.USER], response_model=User, status_code=HTTPStatus.OK)
def update_user(uid: UUID, data: UserUpdate) -> User:
    return userCRUD.update(uid, data)


@app.get("/user/{uid}/file", tags=[OpenAPITags.USER, OpenAPITags.DASHBOARD], status_code=HTTPStatus.OK)
def download_by_user(uid: UUID) -> StreamingResponse:
    user = userCRUD.get(uid)
    if not user.file_id:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="No cv found")
    content = filesCRUD.get(user.file_id)
    return StreamingResponse(
        content, media_type="application/pdf", headers={"Content-Disposition": f"filename={content.filename}"}
    )


@app.get("/file/{fid}", tags=[OpenAPITags.USER, OpenAPITags.DASHBOARD], status_code=HTTPStatus.OK)
def download_by_id(uid: UUID) -> StreamingResponse:
    user = userCRUD.get(uid)
    if not user.file_id:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="No cv found")
    content = filesCRUD.get(user.file_id)
    return StreamingResponse(
        content, media_type="application/pdf", headers={"Content-Disposition": f"filename={content.filename}"}
    )


@app.post("/file", tags=[OpenAPITags.USER], response_model=UUID, status_code=HTTPStatus.OK)
def upload(file: UploadFile) -> UUID:
    filename = file.filename if file.filename else "cv.pdf"
    fid = filesCRUD.create(filename, file.file.read())
    return fid


@app.get("/file/{fid}/userdata", tags=[OpenAPITags.USER], response_model=UserBase, status_code=HTTPStatus.OK)
def get_userinfo_by_file(fid: UUID) -> UserBase:
    # get file content
    content = filesCRUD.get(fid).read()

    # upload file content
    cv_id = agent.upload_file(content, "cv.pdf")

    # get user data
    ret = agent.request([Prompts.NAME], [cv_id])
    name = loads(ret.output[0].content[0].text)  # type: ignore # TODO - add check
    return UserBase(name_first=name[0], name_second=name[1], file_id=fid, openai_file_id=cv_id)


@app.get("/user/{uid}/question/{qid}", tags=[OpenAPITags.USER], response_model=str, status_code=HTTPStatus.OK)
def get_question_by_user(uid: UUID, qid: int) -> str:
    # get user
    user = userCRUD.get(uid)

    # upload file content
    if not user.openai_file_id:
        if not user.file_id:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="No cv found")
        content = filesCRUD.get(user.file_id).read()
        cv_id = agent.upload_file(content, "cv.pdf")
    else:
        cv_id = user.openai_file_id

    # question
    QUESTIONS = [Prompts.QUESTIONA.value, Prompts.QUESTIONB.value, Prompts.QUESTIONC.value]
    if qid > len(QUESTIONS):
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="qid to large")
    QST = QUESTIONS[qid]

    print(QST)

    # get user data
    psnlt = understand_personality(user.personality)
    ret = agent.request(
        [psnlt, QST],
        [cv_id],
    )
    question = str(ret.output[0].content[0].text)  # type: ignore # TODO - add check
    question.replace('/"', "")
    return question


@app.get("/user/{uid}/offerings", tags=[OpenAPITags.USER], response_model=OfferingRequest, status_code=HTTPStatus.OK)
def get_offerings_by_user(uid: UUID) -> OfferingRequest:
    # get user
    user = userCRUD.get(uid)

    # upload file content
    if not user.openai_file_id:
        if not user.file_id:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="No cv found")
        content = filesCRUD.get(user.file_id).read()
        cv_id = agent.upload_file(content, "cv.pdf")
    else:
        cv_id = user.openai_file_id

    # get user data
    psnlt = understand_personality(user.personality)
    qst = get_user_answers(user)

    ret = agent.request(
        [psnlt, qst, f"Job db: {job_db}", Prompts.OFFERINGS],
        [cv_id],
    )
    jobs_docs = json.loads(ret.output[0].content[0].text)  # type: ignore # TODO - add check
    jobs = [Jobs(**doc) for doc in jobs_docs["output"]]
    reasoning = jobs_docs["reasoning"]
    print(jobs)
    return OfferingRequest(output=jobs, reasoning=reasoning)


@app.post("/user/{uid}/question", tags=[OpenAPITags.USER], response_model=None, status_code=HTTPStatus.OK)
def post_question_by_user(uid: UUID, question: Question) -> User:
    return userCRUD.add_question(uid, question)


@app.get("/user", tags=[OpenAPITags.DASHBOARD], response_model=List[User], status_code=HTTPStatus.OK)
def get_all_user() -> List[User]:
    return userCRUD.get_all()


def start():
    """Launched with `poetry run start` at root level"""
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
