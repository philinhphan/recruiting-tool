from enum import Enum
from typing import List

from openai import OpenAI
from openai.types.responses import ResponseInputItemParam, Response

from backend.models import Personality
from backend.conf import AppConfig


INSTRUCTIONS: str = "You're helping with HR tasks. Make the output readable for a computer. Use the English Language."


class Prompts(str, Enum):
    NAME = f"Extract the information of the file 'cv.pdf' and return only a name list '[\"first\",\"last\"]'. If you cannot find it, return an empty list."
    QUESTIONA = f"On the context of all information, return an user specific question about the technical skills of the user. Return a string."
    QUESTIONB = f"On the context of all information, return an user specific question about the teamwork skills of the user. Return a string."
    QUESTIONC = f"On the context of all information, return an user specific question about the interest and future tasks he wants to work on. Return a string."


def understand_personality(personality: Personality) -> str:
    print(f"Using the personality model of the BIG 5, this user has the following values: {personality.__str__}")
    return f"Using the personality model of the BIG 5, this user has the following values: {personality.__str__}"


class Agent:

    def __init__(self, conf: AppConfig) -> None:
        self._conf = conf
        self._client = OpenAI(api_key=conf.OPENAI)

    def upload_file(self, file: bytes, filename: str) -> str:
        fo = self._client.files.create(file=(filename, file), purpose="user_data")
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
