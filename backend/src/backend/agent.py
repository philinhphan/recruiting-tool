from openai import OpenAI, api_key

from backend.conf import AppConfig

INSTRUCTIONS: str = "You are a pirate"


class Agent:

    def __init__(self, conf: AppConfig) -> None:
        self._conf = conf
        self._client = OpenAI(
            api_key=conf.OPENAI,
        )

    def request(self, input: str, file_context: str = "") -> str:
        req = self._client.responses.create(model=self._conf.MODEL, instructions=INSTRUCTIONS, input=input)
        return req.output_text
