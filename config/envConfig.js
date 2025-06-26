import dotenv from "dotenv";
import path from "path";

const env = process.env.ENV_MODE || "development";
let envFile = ".env";

if (env === "production") {
  envFile = ".env.production";
} else if (env === "development") {
  envFile = ".env.local";
}

dotenv.config({ path: path.resolve(process.cwd(), envFile) });
export const {
  PORT,
  HOST,
  MONGODB_URI,
  JWT_SECRET ,
  JWT_EXPIRATION ,
  JWT_ALGORITHM ,
  JWT_ISSUER ,
  JWT_AUDIENCE ,
  JWT_SUBJECT ,
  NODE_ENV,
  EMAIL_USER,
  EMAIL_PASS
} = process.env;