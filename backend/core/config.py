from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    anthropic_api_key: str
    minio_endpoint: str
    minio_access_key: str
    minio_secret_key: str

    class Config:
        env_file = ".env"

settings = Settings()