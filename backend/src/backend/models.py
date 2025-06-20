from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from enum import Enum


# ================== ENUMS
class ExpertiseLevel(Enum):
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
