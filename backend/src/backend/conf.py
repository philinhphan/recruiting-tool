from dotenv import load_dotenv

from pydantic_settings import BaseSettings, SettingsConfigDict


class DBConfig(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="SQL")

    DSN: str = "postgresql+asyncpg://backend:secret@localhost:5432/users"


class AuthConfig(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="AUTH")

    BASE_URL: str = "http://127.0.0.1:80/kratos"


def init_conf() -> None:
    load_dotenv()
