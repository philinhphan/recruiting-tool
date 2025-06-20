from dotenv import load_dotenv

from pydantic_settings import BaseSettings, SettingsConfigDict


class DBConfig(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="MONGO")

    HOST: str = "localhost"
    PORT: int = 27017


def init_conf() -> None:
    load_dotenv()
