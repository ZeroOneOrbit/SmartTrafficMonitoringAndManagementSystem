import os
from pathlib import Path
from dotenv import load_dotenv

# Base Directory of the smart-traffic-system
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env file
load_dotenv(dotenv_path=BASE_DIR / ".env")

class Settings:
    """Holds configuration settings for the Smart Traffic Monitoring System."""
    
    # MongoDB Config
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "smart_traffic")
    
    # Google Drive Config
    GOOGLE_DRIVE_FOLDER_ID: str = os.getenv("GOOGLE_DRIVE_FOLDER_ID", "")
    SERVICE_ACCOUNT_FILE: str = os.getenv("SERVICE_ACCOUNT_FILE", str(BASE_DIR / "credentials" / "service_account.json"))
    
    # Detection Config
    LOCATION: str = os.getenv("LOCATION", "Intersection A")
    MODEL_PATH: str = os.getenv("MODEL_PATH", str(BASE_DIR / "models" / "best.pt"))
    VIDEO_PATH: str = os.getenv("VIDEO_PATH", str(BASE_DIR / "rec" / "video2.mp4"))

# Global configuration instance
settings = Settings()
