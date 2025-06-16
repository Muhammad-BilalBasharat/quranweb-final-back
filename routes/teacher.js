import express from "express";
import { getTeachers, addTeacher, updateTeacher, deleteTeacher  } from "../controllers/teacher.js";
import verifyToken from "../middlewares/auth.js";
import validateId from "../middlewares/validateId.js";
import{verifyAdminByToken} from "../middlewares/verifyAdmin.js";
const router = express.Router();

router.get("/teachers", getTeachers);
router.post("/teacher", verifyToken,verifyAdminByToken, addTeacher);
router.put("/teacher/:id",verifyToken, verifyAdminByToken, validateId, updateTeacher);
router.delete("/teacher/:id", verifyToken,verifyAdminByToken, validateId, deleteTeacher);

export default router;