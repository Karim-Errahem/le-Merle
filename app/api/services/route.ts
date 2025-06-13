import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"
import NodeCache from "node-cache"

// Initialize cache with 5-minute TTL
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 })

// Define interface for service data
interface ServiceData {
  id: number
  title_fr: string
  title_en: string
  title_ar: string
  description_fr: string
  description_en: string
  description_ar: string
  image: string | null
  features_fr: string[]
  features_en: string[]
  features_ar: string[]
}

// Connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Validate base64 image
const isValidBase64Image = (str: string): boolean => {
  return (
    str.startsWith("data:image/") &&
    str.includes(";base64,") &&
    str.length < 3 * 1024 * 1024 // ~3MB limit
  )
}

// Sanitize features (limit to 50 items, 200 chars each)
const sanitizeFeatures = (features: string[]): string[] => {
  return features.slice(0, 50).map((f) => f.substring(0, 200))
}

export async function GET(request: NextRequest) {
  let connection
  const cacheKey = "services:all"
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "10", 10)
  const offset = (page - 1) * limit

  try {
    // Check cache
    const cached = cache.get<ServiceData[]>(`${cacheKey}:${page}:${limit}`)
    if (cached) {
      return NextResponse.json({ success: true, data: cached })
    }

    connection = await pool.getConnection()

    // Select minimal fields, add pagination
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      "SELECT `id`, `title_fr`, `title_en`, `title_ar`, `description_fr`, `description_en`, `description_ar`, `features_fr`, `features_en`, `features_ar`,`image` FROM `services` ORDER BY `id` DESC LIMIT ? OFFSET ?",
      [limit, offset],
    )

    const services = rows.map((service) => {
      let features_fr: string[] = []
      let features_en: string[] = []
      let features_ar: string[] = []

      try {
        features_fr = service.features_fr ? JSON.parse(service.features_fr) : []
        if (!Array.isArray(features_fr)) features_fr = []
      } catch (e) {
        console.error(`Error parsing features_fr for service ${service.id}:`, e)
        features_fr = []
      }

      try {
        features_en = service.features_en ? JSON.parse(service.features_en) : []
        if (!Array.isArray(features_en)) features_en = []
      } catch (e) {
        console.error(`Error parsing features_en for service ${service.id}:`, e)
        features_en = []
      }

      try {
        features_ar = service.features_ar ? JSON.parse(service.features_ar) : []
        if (!Array.isArray(features_ar)) features_ar = []
      } catch (e) {
        console.error(`Error parsing features_ar for service ${service.id}:`, e)
        features_ar = []
      }

      return {
        ...service,
        features_fr,
        features_en,
        features_ar,
        image: service.image, // Fetch image separately if needed
      } as ServiceData
    })

    // Cache response
    cache.set(`${cacheKey}:${page}:${limit}`, services)

    return NextResponse.json({ success: true, data: services })
  } catch (error) {
    console.error("Erreur lors de la récupération des services:", error)
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}

export async function POST(request: NextRequest) {
  let connection

  try {
    const body = await request.json()
    const {
      title_fr,
      description_fr,
      title_en,
      description_en,
      title_ar,
      description_ar,
      image,
      features_fr,
      features_en,
      features_ar,
    } = body as Partial<ServiceData>

    if (
      !title_fr ||
      !description_fr ||
      !title_en ||
      !description_en ||
      !title_ar ||
      !description_ar ||
      !features_fr ||
      !features_en ||
      !features_ar ||
      !Array.isArray(features_fr) ||
      !Array.isArray(features_en) ||
      !Array.isArray(features_ar) ||
      features_fr.length === 0 ||
      features_en.length === 0 ||
      features_ar.length === 0
    ) {
      return NextResponse.json({ success: false, error: "Tous les champs multilingues et au moins une fonctionnalité par langue sont requis" }, { status: 400 })
    }

    if (image && !isValidBase64Image(image)) {
      return NextResponse.json({ success: false, error: "Format ou taille d'image invalide (max 3MB)" }, { status: 400 })
    }

    connection = await pool.getConnection()

    const [result] = await connection.execute<mysql.ResultSetHeader>(
      "INSERT INTO `services`(`title_fr`, `description_fr`, `title_en`, `description_en`, `title_ar`, `description_ar`, `image`, `features_fr`, `features_en`, `features_ar`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title_fr,
        description_fr,
        title_en,
        description_en,
        title_ar,
        description_ar,
        image ,
        JSON.stringify(sanitizeFeatures(features_fr)),
        JSON.stringify(sanitizeFeatures(features_en)),
        JSON.stringify(sanitizeFeatures(features_ar)),
      ],
    )

    // Invalidate cache
    cache.del("services:all")

    return NextResponse.json({
      success: true,
      message: "Service ajouté avec succès",
      id: result.insertId,
    })
  } catch (error) {
    console.error("Erreur lors de l'ajout du service:", error)
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}