import express from "express";
import { addCourse,getAllCourses,deleteCourse,updateCourse } from "../controllers/course.js";
import verifyToken from "../middlewares/auth.js";
import validateId from "../middlewares/validateId.js";
import {verifyAdminByToken} from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.get("/courses", getAllCourses);
router.post("/course", verifyToken, verifyAdminByToken, addCourse);
router.delete("/course/:id", verifyToken, verifyAdminByToken, validateId, deleteCourse);
router.put("/course/:id", verifyToken, verifyAdminByToken, validateId, updateCourse);
export default router;