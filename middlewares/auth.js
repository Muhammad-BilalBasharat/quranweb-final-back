import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/envConfig.js";

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Authorization failed",
            data: null,
            error: "No token provided",
        });
    }

    jwt.verify(token,JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(404).json({
                message: "Forbidden",
                data: null,
                error: "Invalid token",
            });
        }
        req.userData= decoded;

        next();
    });
  } catch (error) {
    return res.status(401).json({
      message: "internal server error",
      data: null,
      error: error.message,
    });
  }
}
export default verifyToken;