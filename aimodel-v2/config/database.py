import logging
from pymongo import MongoClient
from config.settings import settings

logger = logging.getLogger(__name__)

# Initialize db as None
db = None

if settings.MONGO_URI:
    try:
        # PyMongo clients are thread-safe and handle reconnection automatically.
        # We specify serverSelectionTimeoutMS=5000 to avoid long blocking waits.
        client = MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=5000)
        db = client[settings.DATABASE_NAME]
        logger.info(f"Initialized PyMongo Client for database: '{settings.DATABASE_NAME}'")
    except Exception as e:
        logger.error(f"Failed to initialize PyMongo client: {e}")
        db = None
else:
    logger.error("MONGO_URI not set in environment variables. Database integration will be disabled.")
