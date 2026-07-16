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

    # Camera Registration Config (read from .env, sent to MongoDB on startup)
    CAM_ID: str = os.getenv("CAM_ID", "CAM001")
    CAMERA_NAME: str = os.getenv("CAMERA_NAME", "Default Camera")
    AREA_ID: str = os.getenv("AREA_ID", "AREA_01")
    THANA_ID: str = os.getenv("THANA_ID", "THANA_01")
    STREAM_URL: str = os.getenv("STREAM_URL", "")
    CAMERA_STATUS: str = os.getenv("CAMERA_STATUS", "active")
    CAMERA_TYPE: str = os.getenv("CAMERA_TYPE", "fixed")
    LOCATION_LAT: float = float(os.getenv("LOCATION_LAT", "0.0"))
    LOCATION_LNG: float = float(os.getenv("LOCATION_LNG", "0.0"))

# Global configuration instance
settings = Settings()

