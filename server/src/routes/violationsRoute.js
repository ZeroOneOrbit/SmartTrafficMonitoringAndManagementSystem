import express from "express";
import { getviolations, deleteViolations } from "../controllers/violationsController.js";
import { createVFinal } from "../controllers/finalViolationController.js";
const router = express.Router()

router.get("/admin", getviolations)
router.delete("/admin", deleteViolations)


router.post("/admin/create", createVFinal)


export default router
// ZOOC@admin2293