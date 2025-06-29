import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const imageExists = (imagePath) => {
  return fs.existsSync(imagePath)
}

export const getImagePath = (pageNumber) => {
  const possiblePaths = [
    path.join(__dirname, "..", "..", "images", `${pageNumber}.png`),
    path.join(__dirname, "..", "..", "images", `${pageNumber}.jpg`),
    path.join(__dirname, "..", "..", "images", `${pageNumber}.jpeg`),
    path.join(__dirname, "..", "..", "images", `page_${pageNumber}.png`),
    path.join(__dirname, "..", "..", "images", `page_${pageNumber}.jpg`),
    path.join(__dirname, "..", "..", "images", `page_${pageNumber}.jpeg`),
    path.join(__dirname, "..", "..", "images", `${String(pageNumber).padStart(3, "0")}.png`),
    path.join(__dirname, "..", "..", "images", `${String(pageNumber).padStart(3, "0")}.jpg`),
    path.join(__dirname, "..", "..", "images", `${String(pageNumber).padStart(3, "0")}.jpeg`),
    path.join(__dirname, "..", "..", "images", `page${pageNumber}.png`),
    path.join(__dirname, "..", "..", "images", `page${pageNumber}.jpg`),
    path.join(__dirname, "..", "..", "images", `page${pageNumber}.jpeg`),
  ]

  for (const imagePath of possiblePaths) {
    if (imageExists(imagePath)) {
      console.log(`Found image: ${imagePath}`)
      return imagePath
    }
  }

  console.log(`No image found for page ${pageNumber}`)
  return null
}
