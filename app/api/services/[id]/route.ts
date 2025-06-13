
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
  return str.startsWith("data:image/") && str.includes(";base64,") && str.length < 3 * 1024 * 1024 // ~3MB limit
}

// Sanitize features (limit to 50 items, 200 chars each)
const sanitizeFeatures = (features: string[]): string[] => {
  return features.slice(0, 50).map((f) => f.substring(0, 200))
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  let connection
  const cacheKey = `service:${params.id}`

  try {
    const id = params.id

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ success: false, error: "ID du service invalide" }, { status: 400 })
    }

    // Check cache
    const cached = cache.get<ServiceData>(cacheKey)
    if (cached) {
      return NextResponse.json({ success: true, data: cached })
    }

    connection = await pool.getConnection()

    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      "SELECT `id`, `title_fr`, `title_en`, `title_ar`, `description_fr`, `description_en`, `description_ar`, `features_fr`, `features_en`, `features_ar`,`image` FROM `services` WHERE `id` = ?",
      [id],
    )

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Service non trouvé" }, { status: 404 })
    }

    const service = rows[0] as Omit<ServiceData, "features_fr" | "features_en" | "features_ar"> & {
      features_fr: string
      features_en: string
      features_ar: string
    }

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
      if (!Array.isArray) features_ar = []
    } catch (e) {
      console.error(`Error parsing features_ar for service ${service.id}:`, e)
      features_ar = []
    }

    const responseData: ServiceData = {
      ...service,
      features_fr,
      features_en,
      features_ar,
      image: service.image // Fetch image separately if needed
    }

    // Cache response
    cache.set(cacheKey, responseData)

    return NextResponse.json({
      success: true,
      data: responseData,
    })
  } catch (error) {
    console.error(`Erreur lors de la récupération du service ${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  let connection
  const id = params.id

  try {
    const data = await request.json() as Partial<ServiceData>

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ success: false, error: "ID du service invalide" }, { status: 400 })
    }

    if (
      !data.title_fr ||
      !data.description_fr ||
      !data.title_en ||
      !data.description_en ||
      !data.title_ar ||
      !data.description_ar ||
      !data.features_fr ||
      !data.features_en ||
      !data.features_ar ||
      !Array.isArray(data.features_fr) ||
      !Array.isArray(data.features_en) ||
      !Array.isArray(data.features_ar) ||
      data.features_fr.length === 0 ||
      data.features_en.length === 0 ||
      data.features_ar.length === 0 ||
      (data.image && !isValidBase64Image(data.image))
    ) {
      return NextResponse.json(
        { success: false, error: "Tous les champs multilingues, au moins une fonctionnalité par langue, ou image invalide (max 3MB)" },
        { status: 400 },
      )
    }

    connection = await pool.getConnection()

    const [result] = await connection.execute<mysql.ResultSetHeader>(
      "UPDATE `services` SET `title_fr`=?, `description_fr`=?, `title_en`=?, `description_en`=?, `title_ar`=?, `description_ar`=?, `image`=?, `features_fr`=?, `features_en`=?, `features_ar`=? WHERE `id`=?",
      [
      data.title_fr,
      data.description_fr,
      data.title_en,
      data.description_en,
      data.title_ar,
      data.description_ar,
      data.image || null,
      JSON.stringify(sanitizeFeatures(data.features_fr)),
      JSON.stringify(sanitizeFeatures(data.features_en)),
      JSON.stringify(sanitizeFeatures(data.features_ar)),
      id,
      ],
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Service non trouvé" }, { status: 404 })
    }

    // Invalidate cache
    cache.del(`service:${id}`)

    return NextResponse.json({
      success: true,
      message: "Service mis à jour avec succès",
    })
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du service ${id}:`, error)
      return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  let connection

  try {
    const id = params.id

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ success: false, error: "ID du service invalide" }, { status: 400 })
    }

    connection = await pool.getConnection()

    const [result] = await connection.execute<mysql.ResultSetHeader>("DELETE FROM `services` WHERE `id` = ?", [id])

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Service non trouvé" }, { status: 404 })
    }

    // Invalidate cache
    cache.del(`service:${id}`)

    return NextResponse.json({
      success: true,
      message: "Service supprimé avec succès",
    })
  } catch (error) {
    console.error(`Erreur lors de la suppression du service ${params.id}:`, error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}
