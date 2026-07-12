import os
import logging
import mimetypes
import threading
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from config.settings import settings
from io import BytesIO
from googleapiclient.http import MediaIoBaseUpload

logger = logging.getLogger(__name__)

# Scopes required for uploading files to Drive
SCOPES = ["https://www.googleapis.com/auth/drive.file"]

# Path to the OAuth client secrets file (downloaded from Google Cloud Console)
OAUTH_CLIENT_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "credentials", "oauth_client.json"
)

# Path where the user's access + refresh token is saved after first login
TOKEN_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "credentials", "token.json"
)

# Thread-local storage so each background thread gets its own Drive client
_local_storage = threading.local()


def get_drive_service():
    """
    Returns an authenticated Google Drive service using OAuth 2.0 user credentials.
    On first run, opens a browser window for the user to log in and grant access.
    Subsequent runs use the saved token.json automatically.
    """
    if hasattr(_local_storage, "drive_service") and _local_storage.drive_service is not None:
        return _local_storage.drive_service

    if not os.path.exists(OAUTH_CLIENT_FILE):
        logger.error(
            f"OAuth client file not found at '{OAUTH_CLIENT_FILE}'. "
            "Please download it from Google Cloud Console → APIs & Services → Credentials "
            "and save it as credentials/oauth_client.json"
        )
        return None

    try:
        creds = None

        # Load saved token if it exists
        if os.path.exists(TOKEN_FILE):
            creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

        # If no valid token, run the browser login flow
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
                logger.info("Refreshed Google OAuth token.")
            else:
                logger.info("No valid token found. Opening browser for Google login...")
                flow = InstalledAppFlow.from_client_secrets_file(OAUTH_CLIENT_FILE, SCOPES)
                creds = flow.run_local_server(port=0)
                logger.info("Google login successful!")

            # Save the token for future runs
            with open(TOKEN_FILE, "w") as token_file:
                token_file.write(creds.to_json())
            logger.info(f"Token saved to {TOKEN_FILE}")

        drive_service = build("drive", "v3", credentials=creds)
        _local_storage.drive_service = drive_service
        logger.info(f"Google Drive API ready (thread: {threading.current_thread().name})")
        return drive_service

    except Exception as e:
        logger.error(f"Failed to initialize Google Drive service: {e}")
        return None


def create_folder(folder_name: str, parent_folder_id: str = None) -> str:
    """
    Creates a folder in Google Drive under the authenticated user's account.

    Args:
        folder_name (str): Name of the folder to create.
        parent_folder_id (str, optional): ID of the parent folder.

    Returns:
        str: The created folder's Drive ID, or empty string on failure.
    """
    service = get_drive_service()
    if service is None:
        return ""

    try:
        folder_metadata = {
            "name": folder_name,
            "mimeType": "application/vnd.google-apps.folder"
        }
        if parent_folder_id:
            folder_metadata["parents"] = [parent_folder_id]

        folder = service.files().create(body=folder_metadata, fields="id").execute()
        folder_id = folder.get("id", "")
        logger.info(f"Created Drive folder '{folder_name}' → ID: {folder_id}")
        return folder_id
    except Exception as e:
        logger.error(f"Failed to create Drive folder '{folder_name}': {e}")
        return ""


def upload_file(file_path: str, parent_folder_id: str = None, mime_type: str = None) -> str:
    """
    Uploads a local file to Google Drive using the authenticated user's account.
    Uses the user's own storage quota (e.g. 15 GB free Gmail storage).

    Args:
        file_path (str): Path to the local file to upload.
        parent_folder_id (str, optional): Drive folder ID. Falls back to GOOGLE_DRIVE_FOLDER_ID in .env.
        mime_type (str, optional): MIME type of the file. Auto-detected if not provided.

    Returns:
        str: The Drive file ID of the uploaded file, or empty string on failure.
    """
    if not os.path.exists(file_path):
        logger.error(f"File not found locally: '{file_path}'")
        return ""

    if mime_type is None:
        mime_type, _ = mimetypes.guess_type(file_path)
        if mime_type is None:
            mime_type = "application/octet-stream"

    service = get_drive_service()
    if service is None:
        logger.warning(f"Drive service unavailable. Skipping upload for: {file_path}")
        return ""

    try:
        file_name = os.path.basename(file_path)
        file_metadata = {"name": file_name}

        target_folder = parent_folder_id or settings.GOOGLE_DRIVE_FOLDER_ID
        if target_folder:
            file_metadata["parents"] = [target_folder]

        media = MediaFileUpload(file_path, mimetype=mime_type, resumable=True)
        uploaded = service.files().create(
            body=file_metadata,
            media_body=media,
            fields="id"
        ).execute()

        file_id = uploaded.get("id", "")
        logger.info(f"Uploaded '{file_name}' to Drive → ID: {file_id}")
        return file_id
    except Exception as e:
        logger.error(f"Failed to upload '{file_path}' to Drive: {e}")
        return ""


def upload_bytes(file_name: str, file_bytes: bytes, parent_folder_id: str = None, mime_type: str = "image/jpeg") -> str:
    """Uploads raw bytes to Google Drive and returns the file ID.

    This avoids writing the image to disk first.
    """
    service = get_drive_service()
    if service is None:
        return ""

    try:
        file_metadata = {"name": file_name}
        target_folder = parent_folder_id or settings.GOOGLE_DRIVE_FOLDER_ID
        if target_folder:
            file_metadata["parents"] = [target_folder]

        fh = BytesIO(file_bytes)
        media = MediaIoBaseUpload(fh, mimetype=mime_type, resumable=True)
        uploaded = service.files().create(body=file_metadata, media_body=media, fields="id").execute()
        return uploaded.get("id", "")
    except Exception as e:
        logger.error(f"Failed to upload bytes to Drive: {e}")
        return ""
