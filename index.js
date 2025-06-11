import express from "express";
import cors from "cors";
import morgan from "morgan";
import apiLimiter from "./middlewares/apiRateLimt.js";
import Database from "./config/connectDB.js";
import { PORT ,HOST} from "./config/envConfig.js";
import userRoutes from "./routes/user.js";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Api Routes
app.use("/api/auth",apiLimiter,userRoutes)

// URL and DATABASE Connection
app.listen(PORT, HOST, async () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
    await Database();
});