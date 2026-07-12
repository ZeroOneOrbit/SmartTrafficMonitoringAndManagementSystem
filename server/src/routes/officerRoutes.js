import express from "express"
import {createOfficer, updateOfficer, updateOfficerByAdmin, getOfficerSelf, getOfficers,deleteOfficer} from "../controllers/officerController.js"
import officerCreator from "../middleware/officerCreator.js"
const router = express.Router()

router.post("/", officerCreator, createOfficer)
router.put("/me", updateOfficer) // this route id is specialId of the officer
router.put("/:id",officerCreator, updateOfficerByAdmin) //this route id is email of the officer

router.get("/me", getOfficerSelf)
router.get("/admin", officerCreator, getOfficers)
router.delete("/:id", officerCreator, deleteOfficer) //this route id is email of the officer
export default router