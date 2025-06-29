import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import path from "path"
import { TOTAL_JUZ } from "../../config/quran/constants.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load juz data
const juzData = JSON.parse(readFileSync(path.join(__dirname, "..", "..", "data", "quran", "juz-data.json"), "utf8"))

export const getAllJuz = (req, res) => {
  const allJuz = Object.entries(juzData).map(([number, juz]) => ({
    juzNumber: Number.parseInt(number),
    ...juz,
    pagesApiUrl: `/api/quran/juz/${number}/pages`,
  }))

  res.json({
    totalJuz: TOTAL_JUZ,
    juz: allJuz,
  })
}

export const getSpecificJuz = (req, res) => {
  const juzNumberStr = req.params.juzNumber

  // Validate that juzNumber is numeric
  if (!/^\d+$/.test(juzNumberStr)) {
    return res.status(400).json({
      error: "Invalid juz number",
      message: "Juz number must be a positive integer",
    })
  }

  const juzNumber = Number.parseInt(juzNumberStr)

  if (juzNumber < 1 || juzNumber > TOTAL_JUZ) {
    return res.status(400).json({
      error: "Invalid juz number",
      message: `Juz number must be between 1 and ${TOTAL_JUZ}`,
    })
  }

  const juz = juzData[juzNumber]

  if (!juz) {
    return res.status(404).json({
      error: "Juz data not found",
      message: `Data for juz ${juzNumber} not available`,
    })
  }

  res.json({
    juzNumber,
    ...juz,
    pagesApiUrl: `/api/quran/juz/${juzNumber}/pages`,
  })
}

export const getJuzPages = (req, res) => {
  const juzNumberStr = req.params.juzNumber

  // Validate that juzNumber is numeric
  if (!/^\d+$/.test(juzNumberStr)) {
    return res.status(400).json({
      error: "Invalid juz number",
      message: "Juz number must be a positive integer",
    })
  }

  const juzNumber = Number.parseInt(juzNumberStr)

  if (juzNumber < 1 || juzNumber > TOTAL_JUZ) {
    return res.status(400).json({
      error: "Invalid juz number",
      message: `Juz number must be between 1 and ${TOTAL_JUZ}`,
    })
  }

  const juz = juzData[juzNumber]

  if (!juz) {
    return res.status(404).json({
      error: "Juz data not found",
      message: `Data for juz ${juzNumber} not available`,
    })
  }

  const pages = []
  for (let i = juz.startPage; i <= juz.endPage; i++) {
    pages.push({
      pageNumber: i,
      imageUrl: `/images/${i}.png`,
      apiUrl: `/api/quran/page/${i}`,
    })
  }

  res.json({
    juzNumber,
    juzName: juz.name,
    juzArabicName: juz.arabicName,
    totalPages: pages.length,
    pages,
  })
}
