from enum import Enum
from typing import List, Optional

from openai import OpenAI
from openai.types.responses import ResponseInputItemParam, Response

from backend.conf import AppConfig


INSTRUCTIONS: str = "You're helping with HR tasks. Make the output readable for a computer"


class Prompts(str, Enum):
    NAME = f"Extract the information of the file 'cv.pdf' and return only a name list '[\"first\",\"last\"]'. If you cannot find it, return an empty list."


class Agent:

    def __init__(self, conf: AppConfig) -> None:
        self._conf = conf
        self._client = OpenAI(api_key=conf.OPENAI)

    def upload_file(self, file: bytes, filename: str) -> str:
        fo = self._client.files.create(file=(filename, file), purpose="user_data")
        return fo.id

    def request(self, input: str, fids: Optional[List[str]]) -> Response:
        params = [{"type": "input_text", "text": input}]
        if fids:
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
