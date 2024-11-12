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
    # Debug: Print all environment variables (masked for security)
    print("\nEnvironment Variables:")
    for key, value in os.environ.items():
        if 'KEY' in key:
            masked_value = value[:14] + '*' * (len(value) - 12) + value[-4:]
            print(f"{key}: {masked_value}")
        elif 'OPENAI' in key:
            print(f"{key}: {value}")

    # Debug: Print .env file contents
    print("\n.env file contents:")
    if ENV_FILE.exists():
        with open(ENV_FILE, 'r') as f:
            for line in f:
                if line.strip() and not line.strip().startswith('#'):
                    key = line.split('=')[0]
                    value = line.split('=')[1] if len(line.split('=')) > 1 else ''
                    if 'KEY' in key:
                        masked_value = value.strip()[:14] + '*' * (len(value.strip()) - 12) + value.strip()[-4:]
                        print(f"{key}={masked_value}")
                    else:
                        print(line.strip())

    settings = Settings()
    print(f"\nFinal OPENAI_API_KEY being used: {settings.OPENAI_API_KEY[:14]}...")
    return settings