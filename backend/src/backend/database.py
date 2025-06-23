from http import HTTPStatus
from typing import Dict, Optional, List, Union
from uuid import UUID, uuid4

from fastapi import HTTPException
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection
from gridfs import GridFSBucket, GridOut, NoFile

from backend.models import Question, User, UserBase, UserUpdate
from backend.models import JobBase, Job
from backend.models import replace_in, replace_out
from backend.conf import DBConfig


class DatabaseConnector:

    def __init__(self, conf: DBConfig) -> None:
        self._conf = conf

        self._client: MongoClient = MongoClient(host=conf.HOST, port=conf.PORT, uuidRepresentation="standard")
        self._bucket = GridFSBucket(self.db)

    @property
    def db(self) -> Database:
        return self._client.application

    @property
    def collection_users(self) -> Collection:
        return self.db.users

    @property
    def collection_jobs(self) -> Collection:
        return self.db.jobs

    @property
    def bucket(self) -> GridFSBucket:
        return self._bucket


class CRUD:
    def __init__(self, db: DatabaseConnector) -> None:
        self._db = db


class UserCRUD(CRUD):

    def get(self, uid: UUID) -> User:
        user_doc: Optional[Dict] = self._db.collection_users.find_one({"_id": uid})
        if not user_doc:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="User ID not found")

        user = User(**replace_out(user_doc))

        return user

    def get_all(self) -> List[User]:
        user_doc: List[Dict] = self._db.collection_users.find({}).to_list()
        if not user_doc:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Empty")

        users: List[User] = []
        for user in user_doc:
            users.append(User(**replace_out(user)))

        return users

    def create(self, user: UserBase) -> User:
        user = User(**user.model_dump())
        self._db.collection_users.insert_one(replace_in(user.model_dump()))

        return user

    def update(self, uid: UUID, data: UserUpdate) -> User:
        _ = self._db.collection_users.update_one({"_id": uid}, {"$set": {**data.model_dump(exclude_none=True)}})
        user = self.get(uid=uid)
        return user

    def add_question(self, uid: UUID, question: Question) -> User:
        current = self.get(uid=uid).questions
        current.append(question)
        _ = self._db.collection_users.update_one({"_id": uid}, {"$set": {"questions": [mdl.model_dump() for mdl in current]}})
        return self.get(uid=uid)


class FilesCRUD(CRUD):

    def create(self, filename: str, content: Union[str, bytes]) -> UUID:
        fid: UUID = uuid4()
        self._db.bucket.upload_from_stream_with_id(file_id=fid, filename=filename, source=content)

        return fid

    def get(self, file_id: UUID) -> GridOut:
        try:
            out = self._db.bucket.open_download_stream(file_id=file_id)
        except NoFile:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Not found")
        return out


class JobsCRUD(CRUD):

    def create(self, jobBase: JobBase) -> UUID:
        job = Job(**jobBase.model_dump())
        self._db.collection_jobs.insert_one(replace_in(job.model_dump()))

        return job.uuid

    def get_all(self) -> List[Job]:
        job_doc: List[Dict] = self._db.collection_jobs.find({}).to_list()
        if not job_doc:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Empty")

        jobs: List[Job] = []
        for job in job_doc:
            jobs.append(Job(**replace_out(job)))

        return jobs
