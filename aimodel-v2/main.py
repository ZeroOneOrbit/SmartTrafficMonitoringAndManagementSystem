import cv2 as cv
import numpy as np
import pytesseract
import os
import csv
import json
import logging
import threading
from datetime import datetime, timezone
from ultralytics import YOLO
from bson import ObjectId
from concurrent.futures import ThreadPoolExecutor
from http.server import BaseHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn
from urllib.parse import urlparse

from config.settings import settings
from config.database import db

class StreamingHandler(BaseHTTPRequestHandler):
    system = None

    def log_message(self, format, *args):
        return

    def do_GET(self):
        if self.path == '/stream':
            self.send_response(200)
            self.send_header('Age', 0)
            self.send_header('Cache-Control', 'no-cache, private')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Content-Type', 'multipart/x-mixed-replace; boundary=frame')
            self.end_headers()
            try:
                while True:
                    if StreamingHandler.system is None:
                        continue
                    with StreamingHandler.system.frame_lock:
                        frame_bytes = StreamingHandler.system.latest_encoded_frame
                    if frame_bytes is None:
                        continue
                    
                    self.wfile.write(b'--frame\r\n')
                    self.send_header('Content-Type', 'image/jpeg')
                    self.send_header('Content-Length', len(frame_bytes))
                    self.end_headers()
                    self.wfile.write(frame_bytes)
                    self.wfile.write(b'\r\n')
            except Exception:
                pass
        else:
            self.send_error(404)

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    allow_reuse_address = True
    daemon_threads = True

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


class SmartTrafficManagementSystem:
    CAR_CLASS = 2
    MIN_MOVE_PX = 8

    ROI_POINTS = np.array([
        (147, 349),
        (249, 148),
        (448, 148),
        (600, 349),
    ], dtype=np.int32)

    WRONG_WAY_LINE_Y = 349
    SIGNAL_LINE_Y = 400
    STOP_LINE_X1 = 147
    STOP_LINE_X2 = 600

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    OUTPUT_DIR = os.path.join(BASE_DIR, "evidence")
    IMAGES_DIR = os.path.join(OUTPUT_DIR, "images")
    LOG_FILE = os.path.join(OUTPUT_DIR, "violations_log.csv")
    DAILY_COUNT_FILE = os.path.join(BASE_DIR, "daily_count.json")

    def __init__(self, video_path: str):
        logger.info(f"Loading YOLO model from: {settings.MODEL_PATH}")
        self.model = YOLO(settings.MODEL_PATH)
        self.cap = cv.VideoCapture(video_path)
        self.fps = self.cap.get(cv.CAP_PROP_FPS) or 20

        # tracking state
        self.tracked_ids = set()        
        self.wrong_way_ids = set()
        self.violated_ids = set()       
        self.wrong_way_logged = set()   
        self.captured_ids = set()       
        self.track_positions = {}       

        # live / daily counters
        self.live_count = 0
        self.wrong_way_count_today = 0
        self.total_count_today = 0

        self.signal_is_red = False
        self.emergency_mode = False

        self.executor = ThreadPoolExecutor(max_workers=4)
        self._last_realtime_update = None

        self.frame_lock = threading.Lock()
        self.latest_encoded_frame = None

        self._prepare_folders()
        
        # Lock current date based on your local time configuration
        self.current_date = datetime.now().strftime("%Y-%m-%d")
        self._load_daily_count()
        self._register_camera()

    def _prepare_folders(self):
        os.makedirs(self.IMAGES_DIR, exist_ok=True)
        if not os.path.exists(self.LOG_FILE):
            with open(self.LOG_FILE, "w", newline="") as f:
                csv.writer(f).writerow(
                    ["timestamp", "track_id", "violation_type", "plate_number", "image_path", "image_drive_id"]
                )

    def _register_camera(self):
        try:
            if db is None:
                logger.warning("MongoDB not available. Camera registration skipped.")
                return

            camera_doc = {
                "camid": settings.CAM_ID,
                "cameraName": settings.CAMERA_NAME,
                "areaId": settings.AREA_ID,
                "thanaId": settings.THANA_ID,
                "streamUrl": settings.STREAM_URL,
                "status": settings.CAMERA_STATUS,
                "cameraType": settings.CAMERA_TYPE,
                "location": {
                    "latitude": settings.LOCATION_LAT,
                    "longitude": settings.LOCATION_LNG,
                },
            }

            db.cameras.update_one(
                {"camid": settings.CAM_ID},
                {"$set": camera_doc},
                upsert=True,
            )
        except Exception as e:
            logger.error(f"Failed to register camera in DB: {e}")

    def _load_daily_count(self):
        """Loads today's stats securely."""
        if os.path.exists(self.DAILY_COUNT_FILE):
            try:
                with open(self.DAILY_COUNT_FILE) as f:
                    data = json.load(f)
                if data.get("date") == self.current_date:
                    self.total_count_today = data.get("count", 0)
                    self.wrong_way_count_today = data.get("wrong_way_count", 0)
                    return
            except Exception as e:
                logger.warning(f"Failed to read daily count: {e}")
        self.total_count_today = 0
        self.wrong_way_count_today = 0
        self._save_daily_count()

    def _save_daily_count(self):
        try:
            with open(self.DAILY_COUNT_FILE, "w") as f:
                json.dump({
                    "date": self.current_date, 
                    "count": self.total_count_today,
                    "wrong_way_count": self.wrong_way_count_today
                }, f)
        except Exception as e:
            logger.error(f"Failed to write daily count: {e}")

    def _reset_daily_stats(self):
        """Hard reset called instantly at 12:00 AM midnight."""
        self.total_count_today = 0
        self.live_count = 0
        self.wrong_way_count_today = 0
        self.tracked_ids.clear()
        self.wrong_way_ids.clear()
        self.violated_ids.clear()
        self.wrong_way_logged.clear()
        self.captured_ids.clear()
        self.track_positions.clear()
        self._save_daily_count()
        logger.info("Daily statistics successfully reset for the new day.")

    def _start_streaming_server(self):
        StreamingHandler.system = self
        port = 8080
        if settings.STREAM_URL:
            try:
                parsed = urlparse(settings.STREAM_URL)
                if parsed.port:
                    port = parsed.port
            except Exception as e:
                logger.error(f"Failed to parse port from STREAM_URL: {e}")

        def run_server():
            try:
                server = ThreadedHTTPServer(('0.0.0.0', port), StreamingHandler)
                server.serve_forever()
            except Exception as e:
                logger.error(f"Failed to start MJPEG streaming server on port {port}: {e}")

        t = threading.Thread(target=run_server, daemon=True)
        t.start()

    def run(self):
        if not self.cap.isOpened():
            logger.error("Error: Could not open video file or camera stream.")
            return

        self._start_streaming_server()
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
            elif key == ord('e'):
                self.emergency_mode = not self.emergency_mode
                self._update_realtime_db(force=True)

        self.cap.release()
        cv.destroyAllWindows()
        self.executor.shutdown(wait=True)

    def _in_roi(self, x: int, y: int) -> bool:
        return cv.pointPolygonTest(self.ROI_POINTS, (float(x), float(y)), False) >= 0

    def _is_wrong_way(self, track_id: int, cx: int, cy: int) -> bool:
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
        return self.STOP_LINE_X1 <= cx <= self.STOP_LINE_X2 and cy > self.WRONG_WAY_LINE_Y

    def _is_moving_towards_apex(self, prev_cx: int, prev_cy: int, cx: int, cy: int) -> bool:
        apex_x, apex_y = 249, 148
        prev_dist = np.hypot(prev_cx - apex_x, prev_cy - apex_y)
        curr_dist = np.hypot(cx - apex_x, cy - apex_y)
        return curr_dist < prev_dist and cy < prev_cy

    def _crossed_stop_line_on_red(self, track_id: int, prev_cy: float, cy: float, cx: int) -> bool:
        if not self.signal_is_red or prev_cy is None or track_id in self.violated_ids:
            return False
        if cx < self.STOP_LINE_X1 or cx > self.STOP_LINE_X2:
            return False
        return prev_cy < self.SIGNAL_LINE_Y <= cy

    def _update_realtime_db(self, force: bool = False):
        """Checks for date changes at midnight, forces a complete cleanup, and saves data to DB."""
        try:
            if db is None:
                return

            now = datetime.now(timezone.utc)
            local_today = datetime.now().strftime("%Y-%m-%d")
            
            # --- Midnight Check & Reset Logic ---
            if local_today != self.current_date:
                logger.info(f"Midnight detected! Rollover from {self.current_date} to {local_today}.")
                self.current_date = local_today
                self._reset_daily_stats()
                force = True  # Push to database immediately without waiting for throttle

            if not force and self._last_realtime_update is not None:
                elapsed = (now - self._last_realtime_update).total_seconds()
                if elapsed < 1.0:
                    return

            doc = {
                "date": local_today,
                "total": int(self.total_count_today),
                "live_count": int(self.live_count),
                "wrong_way_count": int(self.wrong_way_count_today),
                "last_updated": now.isoformat(),
                "location": {
                    "latitude": settings.LOCATION_LAT,
                    "longitude": settings.LOCATION_LNG,
                },
                "light_status": "red" if self.signal_is_red else "green",
                "emergency_mode": bool(self.emergency_mode),
                "cam_id": settings.CAM_ID,
                "stream_url": settings.STREAM_URL,
            }

            db.realtime_data.update_one(
                {"cam_id": settings.CAM_ID},
                {"$set": doc},
                upsert=True,
            )
            self._last_realtime_update = now
        except Exception as e:
            logger.error(f"Failed to update realtime_data collection: {e}")

    def _read_plate(self, car_crop: np.ndarray) -> str:
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

    def _log_violation(self, track_id: int, violation_type: str, plate_text: str, frame: np.ndarray, car_box: tuple, confidence: float, car_type: str = "vehicle"):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        image_name = f"{violation_type}_{track_id}_{timestamp}.jpg"

        x1, y1, x2, y2 = car_box
        snapshot = frame.copy()
        cv.rectangle(snapshot, (x1, y1), (x2, y2), (0, 0, 255), 2)
        cv.line(snapshot, (self.STOP_LINE_X1, self.WRONG_WAY_LINE_Y), (self.STOP_LINE_X2, self.WRONG_WAY_LINE_Y), (0, 165, 255), 2)
        cv.line(snapshot, (self.STOP_LINE_X1, self.SIGNAL_LINE_Y), (self.STOP_LINE_X2, self.SIGNAL_LINE_Y), (255, 0, 255), 2)

        signal_text = "SIGNAL: RED" if self.signal_is_red else "SIGNAL: GREEN"
        signal_color = (0, 0, 255) if self.signal_is_red else (0, 255, 0)
        cv.putText(snapshot, signal_text, (20, 40), cv.FONT_HERSHEY_SIMPLEX, 1.0, signal_color, 2)

        ok, buf = cv.imencode('.jpg', snapshot)
        if not ok:
            return
        image_bytes = buf.tobytes()
        doc_id = ObjectId()

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

    def _bg_process_violation(self, doc_id: ObjectId, track_id: int, violation_type: str, plate_text: str, image_bytes: bytes, image_name: str, confidence: float, car_type: str = "vehicle"):
        try:
            from config.google_drive import upload_bytes
            image_drive_id = upload_bytes(image_name, image_bytes)

            violation_doc = {
                "id": str(doc_id),
                "time": datetime.now(timezone.utc).isoformat(),
                "car_type": car_type or "vehicle",
                "vehicle_number": plate_text or "N/A",
                "violation_type": violation_type,
                "evidence": {
                    "driveurl": f"https://drive.google.com/file/d/{image_drive_id}/view" if image_drive_id else ""
                },
                "location": settings.THANA_ID,
                "status": "completed",
                "trackid": track_id
            }

            try:
                with open(self.LOG_FILE, "a", newline="") as f:
                    csv.writer(f).writerow([
                        datetime.now(timezone.utc).isoformat(), track_id, violation_type,
                        plate_text or "N/A", image_name, image_drive_id,
                    ])
            except Exception as e:
                logger.error(f"Failed to log violation to CSV: {e}")

            if db is not None:
                db.violations.insert_one(violation_doc)
        except Exception as e:
            logger.error(f"[Background] Error processing violation: {e}")

    def process_frame(self, res, frame: np.ndarray) -> np.ndarray:
        output = frame.copy()
        self.live_count = 0

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

                    car_type = "vehicle"
                    try:
                        if getattr(self, "model", None) is not None:
                            names = getattr(self.model, "names", None)
                            if names is not None and box.cls is not None:
                                idx = int(box.cls[0])
                                car_type = names[idx] if isinstance(names, (list, tuple)) else names.get(idx, "vehicle")
                    except Exception:
                        car_type = "vehicle"

                    if track_id not in self.tracked_ids:
                        self.tracked_ids.add(track_id)
                        self.total_count_today += 1
                        self._save_daily_count()

                    is_signal_violation = self._crossed_stop_line_on_red(track_id, prev_cy, cy, cx)
                    is_wrong_way = self._is_wrong_way(track_id, cx, cy)

                confidence = float(box.conf[0]) if box.conf is not None else 1.0

                if box.id is not None:
                    if is_signal_violation and track_id not in self.violated_ids:
                        self.violated_ids.add(track_id)
                        if track_id not in self.captured_ids:
                            self.captured_ids.add(track_id)
                            plate_text = self._read_plate(frame[y1:y2, x1:x2])
                            self._log_violation(track_id, "signal_violation", plate_text, frame, (x1, y1, x2, y2), confidence, car_type=car_type)

                    if is_wrong_way and track_id not in self.wrong_way_logged:
                        self.wrong_way_count_today += 1
                        self.wrong_way_logged.add(track_id)
                        self._save_daily_count()
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

        try:
            _, jpeg_buf = cv.imencode('.jpg', output)
            if jpeg_buf is not None:
                with self.frame_lock:
                    self.latest_encoded_frame = jpeg_buf.tobytes()
        except Exception as e:
            logger.error(f"Failed to encode frame for live stream: {e}")

        try:
            self._update_realtime_db()
        except Exception:
            pass
        return output

    def _draw_hud(self, output: np.ndarray):
        cv.putText(output, f"Live Cars: {self.live_count}", (20, 40),
                   cv.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        cv.putText(output, f"Total Today: {self.total_count_today}", (20, 75),
                   cv.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        cv.putText(output, f"Wrong Way Today: {self.wrong_way_count_today}", (20, 110),
                   cv.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
        signal_text = "SIGNAL: RED" if self.signal_is_red else "SIGNAL: GREEN"
        signal_color = (0, 0, 255) if self.signal_is_red else (0, 255, 0)
        cv.putText(output, signal_text, (20, 145), cv.FONT_HERSHEY_SIMPLEX, 0.8, signal_color, 2)

        if self.emergency_mode:
            cv.putText(output, "!! EMERGENCY MODE ACTIVE !!", (20, 180),
                       cv.FONT_HERSHEY_SIMPLEX, 0.75, (0, 0, 255), 2)
            cv.rectangle(output, (2, 2), (638, 478), (0, 0, 255), 3)
        else:
            cv.putText(output, "EMERGENCY: OFF", (20, 180),
                       cv.FONT_HERSHEY_SIMPLEX, 0.7, (100, 100, 100), 1)

        cv.putText(output, "[r]=red  [g]=green  [e]=emergency  [q]=quit", (20, 460),
                   cv.FONT_HERSHEY_SIMPLEX, 0.45, (200, 200, 200), 1)


if __name__ == "__main__":
    stms = SmartTrafficManagementSystem(settings.VIDEO_PATH)
    stms.run()