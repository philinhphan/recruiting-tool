from http import HTTPStatus
from typing import Dict, Optional
from uuid import UUID

from fastapi import HTTPException
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection

from backend.models import Personality, User, UserBase
from backend.models import replace_in, replace_out
from backend.conf import DBConfig


class DatabaseConnector:

    def __init__(self, conf: DBConfig) -> None:
        self._conf = conf

        self._client: MongoClient = MongoClient(host=conf.HOST, port=conf.PORT, uuidRepresentation="standard")

    @property
    def db(self) -> Database:
        return self._client.application

    @property
    def collection_users(self) -> Collection:
        return self.db.users


class UserCRUD:
    def __init__(self, db: DatabaseConnector) -> None:
        self._db = db

    def get(self, uid: UUID) -> User:
        user_doc: Optional[Dict] = self._db.collection_users.find_one({"uuid": uid})
        if not user_doc:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="User ID not found")

        user = User(**replace_out(user_doc))

        return user

    def create(self, user: UserBase) -> User:
        user = User(**user.model_dump())
        self._db.collection_users.insert_one(replace_in(user.model_dump()))

        return user

    def update_personality(self, uid: UUID, personality: Personality) -> User:
        user = self.get(uid=uid)

        return user
