from http import HTTPStatus
from typing import Dict, Optional, List, Union
from uuid import UUID, uuid4

from fastapi import HTTPException
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection
from gridfs import GridFSBucket

from backend.models import Personality, User, UserBase
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

    def update_personality(self, uid: UUID, personality: Personality) -> User:
        _ = self._db.collection_users.update_one({"_id": uid}, {"$set": {"personality": personality.model_dump()}})
        user = self.get(uid=uid)

        return user


class FilesCRUD(CRUD):

    def create(self, filename: str, content: Union[str, bytes]) -> UUID:
        fid: UUID = uuid4()
        self._db.bucket.upload_from_stream_with_id(file_id=fid, filename=filename, source=content)

        return fid

    def get(self, file_id: UUID): 
