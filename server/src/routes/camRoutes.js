import {getCamera, getAreacamera} from "../controllers/cameraController.js";
import express from "express"

const router = express.Router()

router.get("/", getCamera)
router.get("/thana", getAreacamera)

export default router