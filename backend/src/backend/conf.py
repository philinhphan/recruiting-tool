from dotenv import load_dotenv

from pydantic_settings import BaseSettings, SettingsConfigDict


class DBConfig(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="MONGO_")

    HOST: str = "localhost"
    PORT: int = 27017


class AppConfig(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="APP_")

    OPENAI: str = ""
    MODEL: str = "gpt-4.1"


def init_conf() -> None:
    load_dotenv()
