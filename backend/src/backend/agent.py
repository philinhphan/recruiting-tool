from enum import Enum
from typing import IO, List

from openai import OpenAI
from openai.types import FilePurpose
from openai.types.responses import ResponseInputItemParam, Response

from backend.models import Personality, User
from backend.conf import AppConfig


INSTRUCTIONS: str = "You're helping with HR tasks. Make the output readable for a computer. Use the English Language."


class Prompts(str, Enum):
    NAME = f"Extract the information of the file 'cv.pdf' and return only a name list '[\"first\",\"last\"]'. If you cannot find it, return an empty list."
    QUESTIONA = f"On the context of all information, return an user specific question about the technical skills of the user. Return a string."
    QUESTIONB = f"On the context of all information, return an user specific question about the teamwork skills of the user. Return a string."
    QUESTIONC = f"On the context of all information, return an user specific question about the interest and future tasks he wants to work on. Return a string."
    OFFERINGS = "In the provided json file with all offerings, find the three best ones for the user and return a json object with the following schema: {reasoning: string, output: list(offering)}, and fill list(offering) with a list of json documents with the schema {title: string, locations: list(string), description: string}."


class Agent:

    def __init__(self, conf: AppConfig) -> None:
        self._conf = conf
        self._client = OpenAI(api_key=conf.OPENAI)

    def upload_file(self, file: bytes | IO, filename: str, type: FilePurpose = "user_data") -> str:
        fo = self._client.files.create(file=(filename, file), purpose=type)
        return fo.id

    def request(self, inputs: List[str] = [], fids: List[str] = []) -> Response:
        params = []
        for text in inputs:
            params.append({"type": "input_text", "text": text})
        for fid in fids:
            params.append({"type": "input_file", "file_id": fid})

        content: List[ResponseInputItemParam] = [
            {
                "role": "user",
                "content": params,
            }  # type: ignore
        ]

        ret = self._client.responses.create(model=self._conf.MODEL, instructions=INSTRUCTIONS, input=content)
        return ret


def understand_personality(personality: Personality) -> str:
    return f"Using the personality model of the BIG 5, this user has the following values (range 1-5): {personality.__str__}"


def get_user_answers(user: User) -> str:
    ret = "The user has answered the following questions: "
    for qts in user.questions:
        ret.join([f"\n - Questions: {qts.question} -> Answer: {qts.answer}"])
    return ret


def init_job_database(agent: Agent, path: str) -> str:
    with open(path, "+rb") as f:
        return agent.upload_file(f, "jobs.txt", "assistants")
