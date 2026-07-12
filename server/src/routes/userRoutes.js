import express from "express";
import { createUser, getuser,  allusers, updateuser, createSocialUser} from "../controllers/userController.js";

import tokenVerify from "../middleware/tokenVerify.js";

const router = express.Router();

router.post("/", createUser); 
router.post("/firebase",tokenVerify, createSocialUser);
router.get("/me", tokenVerify, getuser);
router.get("/admin", allusers);
router.put("/:id", updateuser);
export default router;  