import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { TOTAL_PAGES, TOTAL_SURAHS, TOTAL_JUZ } from "../../config/quran/constants.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const getApiInfo = (req, res) => {
  res.json({
    message: "Quran Images API",
    description: "API to fetch Holy Quran page images",
    version: "1.0.0",
    endpoints: {
      "/quran/": "API information",
      "/api/quran/pages": "Get all pages info",
      "/api/quran/page/:pageNumber": "Get specific page image",
      "/api/quran/surahs": "Get all surahs information",
      "/api/quran/surah/:surahNumber": "Get surah information",
      "/api/quran/surah/:surahNumber/pages": "Get all pages of a surah",
      "/api/quran/juz": "Get all juz information",
      "/api/quran/juz/:juzNumber": "Get juz information",
      "/api/quran/juz/:juzNumber/pages": "Get all pages of a juz",
      "/api/quran/random": "Get random page",
      "/api/quran/search": "Search surahs by name",
      "/quran/health": "Health check",
    },
    totalPages: TOTAL_PAGES,
    totalSurahs: TOTAL_SURAHS,
    totalJuz: TOTAL_JUZ,
  })
}

export const getHealthCheck = (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: "1.0.0",
  })
}

export const getDebugImages = (req, res) => {
  try {
    const imagesDir = path.join(__dirname, "..", "..", "images")

    if (!fs.existsSync(imagesDir)) {
      return res.status(404).json({
        error: "Images directory not found",
        path: imagesDir,
      })
    }

    const files = fs.readdirSync(imagesDir)

    const imageFiles = files.filter(
      (file) =>
        file.toLowerCase().endsWith(".jpg") ||
        file.toLowerCase().endsWith(".jpeg") ||
        file.toLowerCase().endsWith(".png"),
    )

    res.json({
      imagesDirectory: imagesDir,
      totalFiles: files.length,
      imageFiles: imageFiles.slice(0, 10),
      totalImageFiles: imageFiles.length,
      sampleImageUrls: imageFiles.slice(0, 5).map((file) => `/images/${file}`),
      firstFewFiles: files.slice(0, 10),
    })
  } catch (error) {
    res.status(500).json({
      error: "Could not read images directory",
      message: error.message,
    })
  }
}
