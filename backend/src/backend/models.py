from ast import Dict
from typing import Any, Optional
from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from enum import Enum


ID_EXTERNAL: str = "uuid"
ID_INTERNAL: str = "_id"


# ================== ENUMS
class ExpertiseLevel(str, Enum):
    UNDERGRADUATE = "UNDERGRADUATE"
    PDH = "PDH"


# ================== COMMONS


class HasUUID(BaseModel):
    uuid: UUID = Field(default_factory=uuid4)


# ================== APPLICATION


class Personality(BaseModel):
    is_set: bool = False
    axis: float = 0


class UserBase(BaseModel):
    name_first: str
    name_second: str

    expertise: ExpertiseLevel
    personality: Personality = Personality()


class User(UserBase, HasUUID): ...


# ================== HELPERS


def replace_out(model: dict) -> dict:
    model[ID_EXTERNAL] = model.pop(ID_INTERNAL)
    return model


def replace_in(model: dict) -> dict:
    model[ID_INTERNAL] = model.pop(ID_EXTERNAL)
    return model
