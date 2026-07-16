import express from "express"
import {getCamera, getAllCam} from "../controllers/dataController.js"

const router= express.Router()

router.get("/camera/:camId", getCamera)
router.get("/camera", getAllCam)    

export default router