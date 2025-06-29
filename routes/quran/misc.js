import express from "express"
import { getApiInfo, getHealthCheck, getDebugImages } from "../../controllers/quran/misc-controller.js"

const router = express.Router()

router.get("/", getApiInfo)
router.get("/health", getHealthCheck)
router.get("/debug/images", getDebugImages)

export default router
