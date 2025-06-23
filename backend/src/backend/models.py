from typing import Optional, List
from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from enum import Enum


ID_EXTERNAL: str = "uuid"
ID_INTERNAL: str = "_id"


# ================== ENUMS
class UserLevel(str, Enum):
    INITIAL = "initial"
    PERSONALITY = "personality"
    QUESTIONS = "questions"
    DONE = "done"


# ================== COMMONS


class HasUUID(BaseModel):
    uuid: UUID = Field(default_factory=uuid4)


# ================== APPLICATION


class Personality(BaseModel):
    openness: float = 0
    neuroticism: float = 0
    agreeableness: float = 0
    extraversion: float = 0
    conscientiousness: float = 0


class Question(BaseModel):
    question: str
    answer: str


class UserBase(BaseModel):
    name_first: str
    name_second: str

    file_id: Optional[UUID] = None
    openai_file_id: Optional[str] = None
    level: UserLevel = UserLevel.INITIAL
    personality: Personality = Personality()
    questions: List[Question] = []


class User(UserBase, HasUUID): ...


class UserUpdate(BaseModel):
    file_id: Optional[UUID] = None
    level: Optional[UserLevel] = None
    personality: Optional[Personality] = None


class JobBase(BaseModel):
    name: str


class Job(JobBase, HasUUID): ...


# ================== HELPERS


def replace_out(model: dict) -> dict:
    model[ID_EXTERNAL] = model.pop(ID_INTERNAL)
    return model


def replace_in(model: dict) -> dict:
    model[ID_INTERNAL] = model.pop(ID_EXTERNAL)
    return model
