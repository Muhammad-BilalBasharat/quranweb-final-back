import dotenv from "dotenv"
import path from "path"

const env = process.env.ENV_MODE || "development"
let envFile = ".env"

if (env === "production") {
  envFile = ".env.production"
} else if (env === "development") {
  envFile = ".env.local"
}

console.log(`Loading environment from: ${envFile}`)
dotenv.config({ path: path.resolve(process.cwd(), envFile) })

export const {
  PORT,
  HOST,
  MONGODB_URI,
  NODE_ENV,
  CLIENT_URL,
  EMAIL_USER,
  EMAIL_PASS,
} = process.env