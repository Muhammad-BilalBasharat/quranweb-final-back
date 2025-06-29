import express from "express"
import { getAllPages, getSpecificPage, getRandomPage } from "../../controllers/quran/pages-controller.js"

const router = express.Router()

// Use simple route patterns without regex
router.get("/pages", getAllPages)
router.get("/page/:pageNumber", getSpecificPage)
router.get("/random", getRandomPage)

export default router
