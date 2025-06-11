import express from "express";
import { getUsers,signupUser,changePassword,loginUser,getUser } from "../controllers/user.js";
import verifyToken from "../middlewares/auth.js";
import apiLimiter from "../middlewares/apiRateLimt.js";
import validateId from "../middlewares/validateId.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.get("/users", getUsers,verifyToken,verifyAdmin);
router.get("/me", verifyToken,getUser);
router.post("/register",apiLimiter, signupUser);
router.post("/login",apiLimiter, loginUser);
router.put("/change-password/:id", validateId,verifyToken,changePassword);
export default router;