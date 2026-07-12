import os
import sys

# Ensure project root is on the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config.settings import settings
from config.google_drive import get_drive_service, create_folder, upload_file
from pathlib import Path


def run_test():
    print("=" * 52)
    print("  Google Drive OAuth2 Upload Integration Test")
    print("=" * 52)

    # Step 1 — Initialize the Drive service (triggers browser login on first run)
    print("\n[1] Initializing Google Drive service (OAuth2)...")
    service = get_drive_service()
    if not service:
        print("ERROR: Could not initialize Drive service.")
        print("  Make sure 'credentials/oauth_client.json' exists.")
        print("  Download it from: Google Cloud Console → APIs & Services → Credentials")
        return
    print("  Drive service initialized successfully.")

    # Step 2 — Create a test folder inside your configured GOOGLE_DRIVE_FOLDER_ID
    parent = settings.GOOGLE_DRIVE_FOLDER_ID or None
    print(f"\n[2] Creating test folder in Drive (parent: {parent or 'root'})...")
    folder_id = create_folder("Smart Traffic Test Folder", parent_folder_id=parent)
    if not folder_id:
        print("ERROR: Folder creation failed.")
        return
    print(f"  Folder created! ID: {folder_id}")

    # Step 3 — Find a test image from evidence/images
    evidence_dir = Path(__file__).parent / "evidence" / "images"
    images = list(evidence_dir.glob("*.jpg"))
    if not images:
        print("\nERROR: No .jpg files found in evidence/images/.")
        print("  Run main.py first so that some violation images are captured.")
        return
    test_image = images[0]
    print(f"\n[3] Found test image: {test_image.name}")

    # Step 4 — Upload the image into the new folder
    print(f"[4] Uploading '{test_image.name}' to folder ID: {folder_id} ...")
    file_id = upload_file(str(test_image), parent_folder_id=folder_id)
    if file_id:
        print(f"\n  SUCCESS! Image uploaded.")
        print(f"  Drive File ID : {file_id}")
        print(f"  View it at    : https://drive.google.com/file/d/{file_id}/view")
    else:
        print("\n  FAILED: Image upload returned an empty ID. Check the logs above for details.")


if __name__ == "__main__":
    run_test()
