import express from "express";
import { getviolations, deleteViolations } from "../controllers/violationsController.js";
import { createVFinal, getVFinal} from "../controllers/finalViolationController.js";
const router = express.Router()

router.get("/admin", getviolations)
router.delete("/admin", deleteViolations)


router.post("/admin/create", createVFinal)
router.get("/admin/vdata", getVFinal)


export default router
// ZOOC@admin2293