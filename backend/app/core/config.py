from pydantic_settings import BaseSettings
from typing import List
from functools import lru_cache
from enum import Enum
import os
from pathlib import Path

ENV_FILE = Path(__file__).parent.parent.parent / '.env'

class EnvironmentType(str, Enum):
    DEVELOPMENT = "development"
    PRODUCTION = "production"
    TESTING = "testing"

class Settings(BaseSettings):
    """Application settings"""
    # Basic settings
    PROJECT_NAME: str = "Go Develop Something"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: EnvironmentType = EnvironmentType.DEVELOPMENT
    
    # OpenAI settings
    OPENAI_API_KEY: str
    MODEL_VERSION: str = "gpt-4o"
    MODEL_TEMP: float = 0.5
    
    # CORS settings
    CORS_ORIGINS: str = "http://localhost:5173"  # Default to Vite's dev server
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = str(ENV_FILE)
        case_sensitive = True
        use_enum_values = True

@lru_cache()
def get_settings() -> Settings:
    settings = Settings()
    return settings