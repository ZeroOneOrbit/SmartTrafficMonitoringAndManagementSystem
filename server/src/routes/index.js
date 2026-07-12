import express from "express";
import userRoutes from "./userRoutes.js";
import officerRoutes from "./officerRoutes.js";
import driverRoutes from "./driverRoutes.js";
import violation from "./violationsRoute.js";



const router = express.Router();

router.use("/user", userRoutes);
router.use("/officer", officerRoutes);
router.use("/driver", driverRoutes);
router.use("/violation", violation)



export default router;