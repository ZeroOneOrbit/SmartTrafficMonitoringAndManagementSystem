import cv2 as cv
import numpy as np
import pytesseract
import os
import csv
import json
import logging
from datetime import datetime, timezone
from ultralytics import YOLO
from bson import ObjectId
from concurrent.futures import ThreadPoolExecutor

from config.settings import settings
from config.database import db
from config.google_drive import upload_file

# Set up logging format
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


class SmartTrafficManagementSystem:
    # ---------------- CONFIG (tune these for your camera) ----------------
    CAR_CLASS = 2
    MIN_MOVE_PX = 8

    # Lane region where cars are counted
    ROI_POINTS = np.array([
        (147, 349),
        (249, 148),
        (448, 148),
        (600, 349),
    ], dtype=np.int32)

    # Horizontal wrong-way line at the bottom of the ROI.
    # A car bottom point moving above this line toward the apex is wrong way.
    WRONG_WAY_LINE_Y = 349

    # Separate red-light violation line below the wrong-way line.
    SIGNAL_LINE_Y = 400
    STOP_LINE_X1 = 147
    STOP_LINE_X2 = 600

    # Directory settings relative to the script location
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    OUTPUT_DIR = os.path.join(BASE_DIR, "evidence")
    IMAGES_DIR = os.path.join(OUTPUT_DIR, "images")
    LOG_FILE = os.path.join(OUTPUT_DIR, "violations_log.csv")
    DAILY_COUNT_FILE = os.path.join(BASE_DIR, "daily_count.json")

    def __init__(self, video_path: str):
        """Initializes the traffic monitoring system.
        
        Args:
            video_path (str): Path to the input video file or stream.
        """
        logger.info(f"Loading YOLO model from: {settings.MODEL_PATH}")
        self.model = YOLO(settings.MODEL_PATH)
        self.cap = cv.VideoCapture(video_path)
        self.fps = self.cap.get(cv.CAP_PROP_FPS) or 20

        # tracking state
        self.tracked_ids = set()        # every car ID ever seen (for the daily total)
        self.wrong_way_ids = set()
        self.violated_ids = set()       # signal-violation IDs (logged once each)
        self.wrong_way_logged = set()   # wrong-way IDs (logged once each)
        self.captured_ids = set()       # track IDs already saved to one image
        self.track_positions = {}       # id -> last (cx, cy)

        # live counters
        self.live_count = 0
        self.wrong_way_count = 0
        self.total_count_today = 0

        # signal state: toggle manually with 'r' (red) / 'g' (green) keys.
        self.signal_is_red = False

        # ThreadPoolExecutor for background network I/O tasks
        self.executor = ThreadPoolExecutor(max_workers=4)
        # Last time realtime DB was updated (throttle updates)
        self._last_realtime_update = None

        self._prepare_folders()
        self._load_daily_count()

    # ---------------- setup helpers ----------------
    def _prepare_folders(self):
        """Creates the local storage folder and initializes the CSV log file."""
        os.makedirs(self.IMAGES_DIR, exist_ok=True)
        if not os.path.exists(self.LOG_FILE):
            with open(self.LOG_FILE, "w", newline="") as f:
                csv.writer(f).writerow(
                    ["timestamp", "track_id", "violation_type", "plate_number", "image_path", "image_drive_id"]
                )

    def _load_daily_count(self):
        """Loads today's daily count of total vehicles processed."""
        today = datetime.now().strftime("%Y-%m-%d")
        if os.path.exists(self.DAILY_COUNT_FILE):
            try:
                with open(self.DAILY_COUNT_FILE) as f:
                    data = json.load(f)
                if data.get("date") == today:
                    self.total_count_today = data.get("count", 0)
                    return
            except Exception as e:
                logger.warning(f"Failed to read daily count: {e}")
        self.total_count_today = 0
        self._save_daily_count()

    def _save_daily_count(self):
        """Saves today's daily count of total vehicles to a local file."""
        today = datetime.now().strftime("%Y-%m-%d")
        try:
            with open(self.DAILY_COUNT_FILE, "w") as f:
                json.dump({"date": today, "count": self.total_count_today}, f)
        except Exception as e:
            logger.error(f"Failed to write daily count: {e}")

    # ---------------- main loop ----------------
    def run(self):
        """Starts the video detection loop."""
        if not self.cap.isOpened():
            logger.error("Error: Could not open video file or camera stream.")
            return

        logger.info("Smart Traffic Management System started. Press [q] to quit, [r] for RED light, [g] for GREEN light.")
        while True:
            ret, frame = self.cap.read()
            if not ret:
                break

            frame = cv.resize(frame, (640, 480))

            res = self.model.track(
                frame,
                persist=True,
                classes=[self.CAR_CLASS],
                verbose=False,
                conf=0.3,
                tracker="bytetrack.yaml",
            )

            output = self.process_frame(res, frame)

            cv.imshow("Smart Traffic Management System", output)

            key = cv.waitKey(1) & 0xFF
            if key == ord('q'):
                break
            elif key == ord('r'):
                self.signal_is_red = True
            elif key == ord('g'):
                self.signal_is_red = False

        # Graceful cleanup
        self.cap.release()
        cv.destroyAllWindows()

        # Shut down executor and wait for outstanding background uploads to finish
        logger.info("Shutting down background tasks. Please wait for pending uploads...")
        self.executor.shutdown(wait=True)
        logger.info("System clean shutdown completed.")

    # ---------------- geometry helpers ----------------
    def _in_roi(self, x: int, y: int) -> bool:
        """Checks if a coordinates point is inside the region of interest."""
        return cv.pointPolygonTest(self.ROI_POINTS, (float(x), float(y)), False) >= 0

    def _is_wrong_way(self, track_id: int, cx: int, cy: int) -> bool:
        """Determines if a tracked car is moving in the wrong direction."""
        prev = self.track_positions.get(track_id)
        self.track_positions[track_id] = (cx, cy)

        if prev is None:
            return track_id in self.wrong_way_ids

        prev_cx, prev_cy = prev
        if (
            prev_cy >= self.WRONG_WAY_LINE_Y
            and cy < self.WRONG_WAY_LINE_Y
            and self.STOP_LINE_X1 <= cx <= self.STOP_LINE_X2
            and self._is_moving_towards_apex(prev_cx, prev_cy, cx, cy)
        ):
            self.wrong_way_ids.add(track_id)

        return track_id in self.wrong_way_ids

    def _is_below_wrong_way_line(self, cx: int, cy: int) -> bool:
        """Returns True if the car bottom point is below the wrong-way line segment."""
        return self.STOP_LINE_X1 <= cx <= self.STOP_LINE_X2 and cy > self.WRONG_WAY_LINE_Y

    def _is_below_signal_line(self, cx: int, cy: int) -> bool:
        """Returns True if the car bottom point is below the signal violation line segment."""
        return self.STOP_LINE_X1 <= cx <= self.STOP_LINE_X2 and cy > self.SIGNAL_LINE_Y

    def _is_moving_towards_apex(self, prev_cx: int, prev_cy: int, cx: int, cy: int) -> bool:
        """Returns True if the car is moving toward the upper apex point of the ROI."""
        apex_x, apex_y = 249, 148
        prev_dist = np.hypot(prev_cx - apex_x, prev_cy - apex_y)
        curr_dist = np.hypot(cx - apex_x, cy - apex_y)
        return curr_dist < prev_dist and cy < prev_cy

    def _crossed_stop_line_on_red(self, track_id: int, prev_cy: float, cy: float, cx: int) -> bool:
        """Checks if a car crossed the red-light signal violation line segment."""
        if not self.signal_is_red or prev_cy is None or track_id in self.violated_ids:
            return False
        if cx < self.STOP_LINE_X1 or cx > self.STOP_LINE_X2:
            return False
        return prev_cy < self.SIGNAL_LINE_Y <= cy

    def _update_realtime_db(self):
        """Upserts a realtime_data document with today's date, total count and live count.

        This method is throttled by `self._last_realtime_update` to avoid excessive writes.
        """
        try:
            if db is None:
                return

            now = datetime.now(timezone.utc)
            # throttle to ~1s updates
            if self._last_realtime_update is not None:
                elapsed = (now - self._last_realtime_update).total_seconds()
                if elapsed < 1.0:
                    return

            today = now.strftime("%Y-%m-%d")
            doc = {
                "date": today,
                "total": int(self.total_count_today),
                "live_count": int(self.live_count),
                "last_updated": now.isoformat(),
            }

            # Upsert by date so a new document is created each day (resets automatically)
            db.realtime_data.update_one({"date": today}, {"$set": doc}, upsert=True)
            self._last_realtime_update = now
        except Exception as e:
            logger.error(f"Failed to update realtime_data collection: {e}")

    # ---------------- number plate OCR ----------------
    def _read_plate(self, car_crop: np.ndarray) -> str:
        """Performs OCR to read license plate number from a car crop region."""
        if car_crop is None or car_crop.size == 0:
            return ""

        h, w = car_crop.shape[:2]
        plate_region = car_crop[int(h * 0.55):h, int(w * 0.15):int(w * 0.85)]
        if plate_region.size == 0:
            return ""

        gray = cv.cvtColor(plate_region, cv.COLOR_BGR2GRAY)
        gray = cv.resize(gray, None, fx=2, fy=2, interpolation=cv.INTER_CUBIC)
        gray = cv.bilateralFilter(gray, 11, 17, 17)
        _, thresh = cv.threshold(gray, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)

        config = "--psm 7 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        try:
            text = pytesseract.image_to_string(thresh, config=config)
            return "".join(ch for ch in text if ch.isalnum())
        except Exception as e:
            logger.error(f"Tesseract OCR failed: {e}")
            return ""

    # ---------------- violation capture (image only) ----------------
    def _log_violation(self, track_id: int, violation_type: str, plate_text: str, frame: np.ndarray, car_box: tuple, confidence: float, car_type: str = "vehicle"):
        """Saves a violation snapshot locally, logs it in a local CSV, and queues MongoDB and Google Drive image upload."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        image_name = f"{violation_type}_{track_id}_{timestamp}.jpg"

        # Create snapshot in-memory with stop lines and current signal status drawn
        x1, y1, x2, y2 = car_box
        snapshot = frame.copy()
        cv.rectangle(snapshot, (x1, y1), (x2, y2), (0, 0, 255), 2)
        cv.line(snapshot, (self.STOP_LINE_X1, self.WRONG_WAY_LINE_Y), (self.STOP_LINE_X2, self.WRONG_WAY_LINE_Y), (0, 165, 255), 2)
        cv.line(snapshot, (self.STOP_LINE_X1, self.SIGNAL_LINE_Y), (self.STOP_LINE_X2, self.SIGNAL_LINE_Y), (255, 0, 255), 2)

        signal_text = "SIGNAL: RED" if self.signal_is_red else "SIGNAL: GREEN"
        signal_color = (0, 0, 255) if self.signal_is_red else (0, 255, 0)
        cv.putText(snapshot, signal_text, (20, 40), cv.FONT_HERSHEY_SIMPLEX, 1.0, signal_color, 2)

        # Encode to JPEG in memory
        ok, buf = cv.imencode('.jpg', snapshot)
        if not ok:
            logger.error("Failed to encode snapshot to JPEG; skipping upload")
            return
        image_bytes = buf.tobytes()

        logger.info(f"[VIOLATION] {violation_type} | ID:{track_id} | Plate:{plate_text or 'N/A'} (in-memory)")

        # Generate a unique document ID offline (safe, instantaneous)
        doc_id = ObjectId()

        # Submit image upload and MongoDB insert to background thread (no local file saved)
        self.executor.submit(
            self._bg_process_violation,
            doc_id,
            track_id,
            violation_type,
            plate_text,
            image_bytes,
            image_name,
            confidence,
            car_type
        )

    # ---------------- background tasks ----------------
    def _bg_process_violation(self, doc_id: ObjectId, track_id: int, violation_type: str, plate_text: str, image_bytes: bytes, image_name: str, confidence: float, car_type: str = "vehicle"):
        """Asynchronously uploads the violation image to Google Drive and creates the MongoDB record."""
        try:
            # 1. Upload image to Google Drive
            logger.info(f"[Background] Uploading image: {image_name}")
            from config.google_drive import upload_bytes
            image_drive_id = upload_bytes(image_name, image_bytes)

            # 2. Build the database document with the specified schema
            violation_doc = {
                "id": str(doc_id),
                "time": datetime.now(timezone.utc).isoformat(),
                "car_type": car_type or "vehicle",
                "vehicle_number": plate_text or "N/A",
                "violation_type": violation_type,
                "evidence": {
                    "driveurl": f"https://drive.google.com/file/d/{image_drive_id}/view" if image_drive_id else ""
                },
                "location": settings.LOCATION,
                "status": "completed",
                "trackid": track_id
            }

            # 3. Write to local CSV log (image saved to Drive, local path removed)
            try:
                with open(self.LOG_FILE, "a", newline="") as f:
                    csv.writer(f).writerow([
                        datetime.now(timezone.utc).isoformat(), track_id, violation_type,
                        plate_text or "N/A", image_name, image_drive_id,
                    ])
            except Exception as e:
                logger.error(f"Failed to log violation to CSV: {e}")

            # 4. Store in MongoDB
            if db is not None:
                db.violations.insert_one(violation_doc)
                logger.info(f"[Background] Successfully inserted violation {doc_id} into MongoDB. Drive ID: {image_drive_id}")
            else:
                logger.warning(f"[Background] MongoDB not available. Violation {doc_id} not saved to DB.")

        except Exception as e:
            logger.error(f"[Background] Error processing violation: {e}")

    # ---------------- per-frame processing ----------------
    def process_frame(self, res, frame: np.ndarray) -> np.ndarray:
        """Processes a single video frame for vehicle tracking and violations."""
        output = frame.copy()
        self.live_count = 0
        self.wrong_way_count = 0

        cv.polylines(output, [self.ROI_POINTS], isClosed=True, color=(0, 0, 255), thickness=2)
        cv.line(output, (self.STOP_LINE_X1, self.WRONG_WAY_LINE_Y), (self.STOP_LINE_X2, self.WRONG_WAY_LINE_Y), (0, 165, 255), 2)
        cv.line(output, (self.STOP_LINE_X1, self.SIGNAL_LINE_Y), (self.STOP_LINE_X2, self.SIGNAL_LINE_Y), (255, 0, 255), 2)

        frame_seen_ids = set()
        for r in res:
            boxes = r.boxes
            if boxes is None or not len(boxes):
                continue

            for box in boxes:
                if int(box.cls[0]) != self.CAR_CLASS:
                    continue

                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cx = int((x1 + x2) / 2)
                cy = y2

                if not self._in_roi(cx, cy) and not self._is_below_wrong_way_line(cx, cy):
                    continue

                track_id = None
                if box.id is not None:
                    track_id = int(box.id[0])
                    if track_id in frame_seen_ids:
                        continue
                    frame_seen_ids.add(track_id)

                self.live_count += 1

                is_wrong_way = False
                is_signal_violation = False

                if box.id is not None:
                    track_id = int(box.id[0])
                    prev = self.track_positions.get(track_id)
                    prev_cy = prev[1] if prev else None

                    # determine detected class name if available
                    car_type = "vehicle"
                    try:
                        if getattr(self, "model", None) is not None:
                            names = getattr(self.model, "names", None)
                            if names is not None and box.cls is not None:
                                idx = int(box.cls[0])
                                if isinstance(names, (list, tuple)):
                                    car_type = names[idx]
                                else:
                                    car_type = names.get(idx, "vehicle")
                    except Exception:
                        car_type = "vehicle"

                    if track_id not in self.tracked_ids:
                        self.tracked_ids.add(track_id)
                        self.total_count_today += 1
                        self._save_daily_count()

                    is_signal_violation = self._crossed_stop_line_on_red(track_id, prev_cy, cy, cx)
                    is_wrong_way = self._is_wrong_way(track_id, cx, cy)

                # Get detection confidence
                confidence = float(box.conf[0]) if box.conf is not None else 1.0

                if box.id is not None:
                    if is_signal_violation and track_id not in self.violated_ids:
                        self.violated_ids.add(track_id)
                        if track_id not in self.captured_ids:
                            self.captured_ids.add(track_id)
                            plate_text = self._read_plate(frame[y1:y2, x1:x2])
                            self._log_violation(track_id, "signal_violation", plate_text, frame, (x1, y1, x2, y2), confidence, car_type=car_type)

                    if is_wrong_way and track_id not in self.wrong_way_logged:
                        self.wrong_way_count += 1
                        self.wrong_way_logged.add(track_id)
                        if track_id not in self.captured_ids:
                            self.captured_ids.add(track_id)
                            plate_text = self._read_plate(frame[y1:y2, x1:x2])
                            self._log_violation(track_id, "wrong_way", plate_text, frame, (x1, y1, x2, y2), confidence, car_type=car_type)

                color = (0, 0, 255) if (is_wrong_way or is_signal_violation) else (0, 255, 0)
                label = f"ID:{track_id}" if track_id is not None else "car"
                if is_wrong_way:
                    label += " WRONG WAY"
                if is_signal_violation:
                    label += " SIGNAL VIOLATION"

                cv.rectangle(output, (x1, y1), (x2, y2), color, 2)
                cv.putText(output, label, (x1, max(y1 - 10, 15)), cv.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        self._draw_hud(output)
        # update realtime DB (throttled inside the helper)
        try:
            self._update_realtime_db()
        except Exception:
            pass
        return output

    def _draw_hud(self, output: np.ndarray):
        """Draws the HUD overlays containing telemetry information on the frame."""
        cv.putText(output, f"Live Cars: {self.live_count}", (20, 40),
                   cv.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        cv.putText(output, f"Total Today: {self.total_count_today}", (20, 75),
                   cv.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        cv.putText(output, f"Wrong Way: {self.wrong_way_count}", (20, 110),
                   cv.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
        signal_text = "SIGNAL: RED" if self.signal_is_red else "SIGNAL: GREEN"
        signal_color = (0, 0, 255) if self.signal_is_red else (0, 255, 0)
        cv.putText(output, signal_text, (20, 145), cv.FONT_HERSHEY_SIMPLEX, 0.8, signal_color, 2)
        cv.putText(output, "[r]=red  [g]=green  [q]=quit", (20, 460),
                   cv.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)


if __name__ == "__main__":
    stms = SmartTrafficManagementSystem(settings.VIDEO_PATH)
    stms.run()
