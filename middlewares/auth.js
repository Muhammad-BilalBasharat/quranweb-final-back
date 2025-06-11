import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/envConfig.js";

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from the Authorization header
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
        req.user = decoded; // Store user ID in request object for later use
        next();// Proceed to the next middleware or route handler
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