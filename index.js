import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import apiLimiter from "./middlewares/apiRateLimt.js";
import Database from "./config/connectDB.js";
import { PORT ,HOST} from "./config/envConfig.js";
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import contactRoutes from "./routes/contact.js";
import studentRoutes from "./routes/student.js";
import teacherRoutes from "./routes/teacher.js";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());

// Api Routes
app.use("/api/auth",apiLimiter,userRoutes)
app.use("/api/class",courseRoutes)
app.use("/api/contact",contactRoutes)
app.use("/api/student",studentRoutes)
app.use("/api/teacher",teacherRoutes)




// URL and DATABASE Connection
app.listen(PORT, HOST, async () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
    await Database();
});