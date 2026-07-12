import express from "express"
import {createDriver, updateDriver, updateDriverPoint, getDriverSelf} from "../controllers/driverController.js"
import officerCreator from "../middleware/officerCreator.js"

const router = express.Router()

router.post("/", createDriver)
router.put("/", updateDriver)
router.put("/admin/:vehicleNumber", officerCreator, updateDriverPoint)
router.get("/me", getDriverSelf)


export default router 
