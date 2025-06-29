import express from "express"
import {
  getAllSurahs,
  getSpecificSurah,
  getSurahPages,
  searchSurahs,
} from "../../controllers/quran/surah-controller.js"

const router = express.Router()

// Use simple route patterns without regex
router.get("/surahs", getAllSurahs)
router.get("/surah/:surahNumber", getSpecificSurah)
router.get("/surah/:surahNumber/pages", getSurahPages)
router.get("/search", searchSurahs)

export default router
