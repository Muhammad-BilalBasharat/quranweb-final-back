import fs from "fs"
import { TOTAL_PAGES } from "../../config/quran/constants.js"
import { getImagePath } from "../../utils/quran/image-utils.js"

export const getAllPages = (req, res) => {
  const { limit = 10, offset = 0 } = req.query
  const limitNum = Math.min(Number.parseInt(limit), 100)
  const offsetNum = Number.parseInt(offset)

  const pages = []
  const start = Math.max(1, offsetNum + 1)
  const end = Math.min(TOTAL_PAGES, start + limitNum - 1)

  for (let i = start; i <= end; i++) {
    pages.push({
      pageNumber: i,
      imageUrl: `/images/${i}.jpg`,
      apiUrl: `/api/quran/page/${i}`,
    })
  }

  res.json({
    pages,
    pagination: {
      total: TOTAL_PAGES,
      limit: limitNum,
      offset: offsetNum,
      hasNext: end < TOTAL_PAGES,
      hasPrevious: start > 1,
    },
  })
}

export const getSpecificPage = (req, res) => {
  const pageNumberStr = req.params.pageNumber

  // Validate that pageNumber is numeric
  if (!/^\d+$/.test(pageNumberStr)) {
    return res.status(400).json({
      error: "Invalid page number",
      message: "Page number must be a positive integer",
    })
  }

  const pageNumber = Number.parseInt(pageNumberStr)

  if (pageNumber < 1 || pageNumber > TOTAL_PAGES) {
    return res.status(400).json({
      error: "Invalid page number",
      message: `Page number must be between 1 and ${TOTAL_PAGES}`,
    })
  }

  const imagePath = getImagePath(pageNumber)

  if (!imagePath) {
    return res.status(404).json({
      error: "Image not found",
      message: `Image for page ${pageNumber} not found`,
      pageNumber,
    })
  }

  const acceptHeader = req.get("Accept")
  const wantsJson = req.query.format === "json" || (acceptHeader && acceptHeader.includes("application/json"))

  if (wantsJson) {
    const stats = fs.statSync(imagePath)
    res.json({
      pageNumber,
      imageUrl: `/images/${pageNumber}.jpg`,
      directImageUrl: `${req.protocol}://${req.get("host")}/api/quran/page/${pageNumber}?format=image`,
      fileSize: stats.size,
      lastModified: stats.mtime,
    })
  } else {
    res.sendFile(imagePath)
  }
}

export const getRandomPage = (req, res) => {
  const randomPage = Math.floor(Math.random() * TOTAL_PAGES) + 1

  res.json({
    pageNumber: randomPage,
    imageUrl: `/images/${randomPage}.jpg`,
    apiUrl: `/api/quran/page/${randomPage}`,
    message: "Random Quran page",
  })
}
