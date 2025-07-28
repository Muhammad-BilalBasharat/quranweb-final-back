import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import path from "path"
import { TOTAL_SURAHS } from "../../config/quran/constants.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load surah data
const surahData = JSON.parse(readFileSync(path.join(__dirname, "..", "..", "data", "quran", "surah-data.json"), "utf8"))

export const getAllSurahs = (req, res) => {
  const allSurahs = Object.entries(surahData).map(([number, surah]) => ({
    surahNumber: Number.parseInt(number),
    ...surah,
    pagesApiUrl: `/api/quran/surah/${number}/pages`,
  }))

  res.json({
    totalSurahs: TOTAL_SURAHS,
    surahs: allSurahs,
  })
}

export const getSpecificSurah = (req, res) => {
  const surahNumberStr = req.params.surahNumber

  // Validate that surahNumber is numeric
  if (!/^\d+$/.test(surahNumberStr)) {
    return res.status(400).json({
      error: "Invalid surah number",
      message: "Surah number must be a positive integer",
    })
  }

  const surahNumber = Number.parseInt(surahNumberStr)

  if (surahNumber < 1 || surahNumber > TOTAL_SURAHS) {
    return res.status(400).json({
      error: "Invalid surah number",
      message: `Surah number must be between 1 and ${TOTAL_SURAHS}`,
    })
  }

  const surah = surahData[surahNumber]

  if (!surah) {
    return res.status(404).json({
      error: "Surah data not found",
      message: `Data for surah ${surahNumber} not available`,
    })
  }

  res.json({
    surahNumber,
    ...surah,
    pagesApiUrl: `/api/quran/surah/${surahNumber}/pages`,
  })
}

export const getSurahPages = (req, res) => {
  const surahNumberStr = req.params.surahNumber

  // Validate that surahNumber is numeric
  if (!/^\d+$/.test(surahNumberStr)) {
    return res.status(400).json({
      error: "Invalid surah number",
      message: "Surah number must be a positive integer",
    })
  }

  const surahNumber = Number.parseInt(surahNumberStr)

  if (surahNumber < 1 || surahNumber > TOTAL_SURAHS) {
    return res.status(400).json({
      error: "Invalid surah number",
      message: `Surah number must be between 1 and ${TOTAL_SURAHS}`,
    })
  }

  const surah = surahData[surahNumber]

  if (!surah) {
    return res.status(404).json({
      error: "Surah data not found",
      message: `Data for surah ${surahNumber} not available`,
    })
  }

  const pages = []
  for (let i = surah.startPage; i <= surah.endPage; i++) {
    pages.push({
      pageNumber: i,
      imageUrl: `/images/${i}.jpg`,
      apiUrl: `/api/quran/page/${i}`,
    })
  }

  res.json({
    surahNumber,
    surahName: surah.name,
    surahArabicName: surah.arabicName,
    totalPages: pages.length,
    pages,
  })
}

export const searchSurahs = (req, res) => {
  const { q } = req.query

  if (!q) {
    return res.status(400).json({
      error: "Missing search query",
      message: "Please provide a search query using 'q' parameter",
    })
  }

  const query = q.toLowerCase()
  const results = []

  Object.entries(surahData).forEach(([number, surah]) => {
    if (surah.name.toLowerCase().includes(query) || surah.arabicName.includes(query)) {
      results.push({
        surahNumber: Number.parseInt(number),
        ...surah,
        pagesApiUrl: `/api/quran/surah/${number}/pages`,
      })
    }
  })

  res.json({
    query: q,
    resultsCount: results.length,
    results,
  })
}
