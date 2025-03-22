from pydantic_settings import BaseSettings  # Changed from pydantic import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Project Info
    PROJECT_NAME: str = "CVCraft"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Server Settings
    SERVER_HOST: str = "0.0.0.0"
    SERVER_PORT: int = 8000

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "cvcraft")

    # CORS Settings
    ALLOWED_ORIGINS: List[str] = ["*"]  # Allow all origins

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()