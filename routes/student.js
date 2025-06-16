import express from "express";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.js";
import verifyToken from "../middlewares/auth.js";
import validateId from "../middlewares/validateId.js";
import { verifyAdminByToken } from "../middlewares/verifyAdmin.js";
const router = express.Router();
router.get("/students", getStudents);
router.post("/create-student", verifyToken,verifyAdminByToken, addStudent);
router.put(
  "/update-student/:id",
  verifyToken,
  verifyAdminByToken,
  validateId,
  updateStudent
);
router.delete(
  "/delete-student/:id",
  verifyToken,
  verifyAdminByToken,
  validateId,
  deleteStudent
);
export default router;
