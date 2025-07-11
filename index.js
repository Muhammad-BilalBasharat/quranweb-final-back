import express from "express"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import path from "path"
import { fileURLToPath } from "url"
import cookieParser from "cookie-parser"
import fs from "fs"
import { surahData } from "./data/quran/surahData.js"
import { juzData } from "./data/quran/juzData.js"
import userRoutes from "./routes/user.js"
import contactRoutes from "./routes/contact.js"
import contactEmailRoutes from "./routes/contactEmail.js"
import studentRoutes from "./routes/student.js"
import teacherRoutes from "./routes/teacher.js"

const app = express()
const PORT = process.env.PORT || 4000
const HOST = process.env.HOST || "127.0.0.1"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  }),
)

app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser("wxeftopi50"))
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }))

app.use("/api/auth", userRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/contact-email", contactEmailRoutes)
app.use("/api/student", studentRoutes)
app.use("/api/teacher", teacherRoutes)

// Static files for images
app.use(
  "/images",
  express.static(path.join(__dirname, "images"), {
    setHeaders: (res) => {
      res.set("Access-Control-Allow-Origin", "*")
      res.set("Cache-Control", "public, max-age=86400")
    },
  }),
)

// API Routes

// Get all surahs
app.get("/api/quran/surahs", (req, res) => {
  const allSurahs = Object.entries(surahData).map(([number, surah]) => ({
    surahNumber: Number.parseInt(number),
    ...surah,
    pagesApiUrl: `/api/quran/surah/${number}/pages`,
  }))

  res.json({
    totalSurahs: 114,
    surahs: allSurahs,
  })
})

// Get specific surah
app.get("/api/quran/surah/:surahNumber", (req, res) => {
  const surahNumber = req.params.surahNumber
  const surah = surahData[surahNumber]

  if (!surah) {
    return res.status(404).json({
      error: "Surah not found",
      message: `Surah ${surahNumber} not found`,
    })
  }

  res.json({
    surahNumber: Number.parseInt(surahNumber),
    ...surah,
    pagesApiUrl: `/api/quran/surah/${surahNumber}/pages`,
  })
})

// Get surah pages
app.get("/api/quran/surah/:surahNumber/pages", (req, res) => {
  const surahNumber = req.params.surahNumber
  const surah = surahData[surahNumber]

  if (!surah) {
    return res.status(404).json({
      error: "Surah not found",
      message: `Surah ${surahNumber} not found`,
    })
  }

  const pages = []
  for (let i = surah.startPage; i <= surah.endPage; i++) {
    pages.push({
      pageNumber: i,
      imageUrl: `/images/${i}.png`,
      apiUrl: `/api/quran/page/${i}`,
    })
  }

  res.json({
    surahNumber: Number.parseInt(surahNumber),
    surahName: surah.name,
    surahArabicName: surah.arabicName,
    totalPages: pages.length,
    pages,
  })
})

// Get all juz
app.get("/api/quran/juz", (req, res) => {
  const allJuz = Object.entries(juzData).map(([number, juz]) => ({
    juzNumber: Number.parseInt(number),
    ...juz,
    pagesApiUrl: `/api/quran/juz/${number}/pages`,
  }))

  res.json({
    totalJuz: 30,
    juz: allJuz,
  })
})

// Get specific juz
app.get("/api/quran/juz/:juzNumber", (req, res) => {
  const juzNumber = req.params.juzNumber
  const juz = juzData[juzNumber]

  if (!juz) {
    return res.status(404).json({
      error: "Juz not found",
      message: `Juz ${juzNumber} not found`,
    })
  }

  res.json({
    juzNumber: Number.parseInt(juzNumber),
    ...juz,
    pagesApiUrl: `/api/quran/juz/${juzNumber}/pages`,
  })
})

// Get juz pages
app.get("/api/quran/juz/:juzNumber/pages", (req, res) => {
  const juzNumber = req.params.juzNumber
  const juz = juzData[juzNumber]

  if (!juz) {
    return res.status(404).json({
      error: "Juz not found",
      message: `Juz ${juzNumber} not found`,
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
    juzNumber: Number.parseInt(juzNumber),
    juzName: juz.name,
    juzArabicName: juz.arabicName,
    totalPages: pages.length,
    pages,
  })
})

// Get specific page
app.get("/api/quran/page/:pageNumber", (req, res) => {
  const pageNumber = Number.parseInt(req.params.pageNumber)

  if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > 604) {
    return res.status(400).json({
      error: "Invalid page number",
      message: "Page number must be between 1 and 604",
    })
  }

  const imagePath = path.join(__dirname, "images", `${pageNumber}.png`)

  if (req.query.format === "json") {
    res.json({
      pageNumber,
      imageUrl: `/images/${pageNumber}.png`,
      exists: fs.existsSync(imagePath),
    })
  } else {
    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath)
    } else {
      res.status(404).json({
        error: "Image not found",
        message: `Image for page ${pageNumber} not found`,
      })
    }
  }
})

// Health check
app.get("/quran/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    message: "Quran API is running",
    totalSurahs: Object.keys(surahData).length,
    totalJuz: Object.keys(juzData).length,
  })
})

// Test endpoint
app.get("/api/test-image/:pageNumber", (req, res) => {
  const pageNumber = req.params.pageNumber
  const imagePath = path.join(__dirname, "images", `${pageNumber}.png`)

  res.json({
    exists: fs.existsSync(imagePath),
    path: imagePath,
    url: `/images/${pageNumber}.png`,
    fullUrl: `http://${HOST}:${PORT}/images/${pageNumber}.png`,
  })
})

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err.message)
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  })
})

app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: "Endpoint not found",
    requestedUrl: req.url,
  })
})

// Start server
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`)
  console.log(`📖 Quran API: http://${HOST}:${PORT}/quran/health`)
  console.log(`📚 Total Surahs: ${Object.keys(surahData).length}`)
  console.log(`📖 Total Juz: ${Object.keys(juzData).length}`)

  // Check images directory
  const imagesDir = path.join(__dirname, "images")
  if (!fs.existsSync(imagesDir)) {
    console.log("📁 Creating images directory...")
    fs.mkdirSync(imagesDir, { recursive: true })
  }

  const files = fs.readdirSync(imagesDir)
  const imageFiles = files.filter((f) => f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith(".jpeg"))
  console.log(`📸 Found ${imageFiles.length} images`)
})
