import express from "express";
import {
  getUsers,
  signupUser,
  changePassword,
  loginUser,
  getUser,
  deleteUser,
  updateUser,
} from "../controllers/user.js";
import verifyToken from "../middlewares/auth.js";
import apiLimiter from "../middlewares/apiRateLimt.js";
import validateId from "../middlewares/validateId.js";
import {
  verifyAdminByParam,
  verifyAdminByToken,
} from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.get("/users", getUsers, verifyToken, verifyAdminByParam);
router.get("/me", verifyToken, getUser);
router.post("/register", apiLimiter, signupUser);
router.post("/login", apiLimiter, loginUser);
router.put("/change-password", verifyToken, changePassword);
router.delete(
  "/users/:id",
  verifyToken,
  verifyAdminByToken,
  validateId,
  deleteUser
);
router.put(
  "/users/:id",
  verifyToken,              
  validateId,
  updateUser
)
export default router;
