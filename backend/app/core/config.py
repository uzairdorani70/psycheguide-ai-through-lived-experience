import os
from pathlib import Path
from dotenv import load_dotenv

# Resolve the .env file relative to this file's location:
# backend/app/core/config.py -> .parent.parent.parent le jayega backend/ tak
BASE_DIR = Path(__file__).resolve().parent.parent.parent
_env_path = BASE_DIR / ".env"

# Load environment variables
load_dotenv(dotenv_path=_env_path)

class Settings:
    # --- Database Settings ---
    MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DB_NAME = os.getenv("DB_NAME", "psycheguide_db")
    
    # --- AI Keys ---
    # Groq Key (Ye lazmi chahiye)
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    
    # Gemini Key (Backup ke liye rakh sakte hain)
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    
    # --- Security & Auth ---
    SECRET_KEY = os.getenv("SECRET_KEY", "your_super_secret_fallback_key")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    
    # --- Mail Settings ---
    MAIL_USER = os.getenv("MAIL_USER")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

    # Debugging ke liye (Sirf development mein use karein)
    def __init__(self):
        if not self.GROQ_API_KEY:
            print("WARNING: GROQ_API_KEY is missing in .env file!")

settings = Settings()