import express from "express"
import { getAllJuz, getSpecificJuz, getJuzPages } from "../../controllers/quran/juz-controller.js"

const router = express.Router()

// Use simple route patterns without regex
router.get("/juz", getAllJuz)
router.get("/juz/:juzNumber", getSpecificJuz)
router.get("/juz/:juzNumber/pages", getJuzPages)

export default router
