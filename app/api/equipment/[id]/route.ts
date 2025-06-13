
import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"
import NodeCache from "node-cache"
import pool from '@/lib/db'
// Initialize cache with 5-minute TTL
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 })

// Define interface for equipment data
interface EquipmentData {
  id: number
  type_fr: string
  type_en: string | null
  type_ar: string | null
  name_fr: string
  name_en: string | null
  name_ar: string | null
  description_fr: string
  description_en: string | null
  description_ar: string | null
  image: string | null
  date_creation: string
  features_fr: string[]
  features_en: string[]
  features_ar: string[]
}



// Validate base64 image (reduced size limit to encourage compression)
const isValidBase64Image = (str: string): boolean => {
  return str.startsWith("data:image/") && str.includes(";base64,") && str.length < 3 * 1024 * 1024; // ~3MB limit
}

// Sanitize features (limit to 50 items, 200 chars each)
const sanitizeFeatures = (features: string[]): string[] => {
  return features.slice(0, 50).map(f => f.substring(0, 200));
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  let connection
  const cacheKey = `equipment:${params.id}`

  try {
    const equipmentId = params.id

    if (!equipmentId || isNaN(Number(equipmentId))) {
      return NextResponse.json({ error: "ID d'équipement invalide" }, { status: 400 })
    }

    // Check cache
    const cached = cache.get<EquipmentData>(cacheKey)
    if (cached) {
      return NextResponse.json({ success: true, data: cached })
    }

    connection = await pool.getConnection()

    // Select minimal fields (exclude image if not needed)
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      "SELECT `id`, `type_fr`, `type_en`, `type_ar`, `name_fr`, `name_en`, `name_ar`, `description_fr`, `description_en`, `description_ar`, `date_creation`, `features_fr`, `features_en`, `features_ar`,`image` FROM `equipment` WHERE id = ?",
      [equipmentId],
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Équipement non trouvé" }, { status: 404 })
    }

    const equipment = rows[0] as Omit<EquipmentData, "features_fr" | "features_en" | "features_ar" | "created_at"> & {
      features_fr: string
      features_en: string
      features_ar: string
    }

    let features_fr: string[] = []
    let features_en: string[] = []
    let features_ar: string[] = []

    try {
      features_fr = equipment.features_fr ? JSON.parse(equipment.features_fr) : []
      if (!Array.isArray(features_fr)) features_fr = []
    } catch (e) {
      console.error(`Error parsing features_fr for equipment ${equipment.id}:`, e)
      features_fr = []
    }

    try {
      features_en = equipment.features_en ? JSON.parse(equipment.features_en) : []
      if (!Array.isArray(features_en)) features_en = []
    } catch (e) {
      console.error(`Error parsing features_en for equipment ${equipment.id}:`, e)
      features_en = []
    }

    try {
      features_ar = equipment.features_ar ? JSON.parse(equipment.features_ar) : []
      if (!Array.isArray(features_ar)) features_ar = []
    } catch (e) {
      console.error(`Error parsing features_ar for equipment ${equipment.id}:`, e)
      features_ar = []
    }

    const responseData: EquipmentData = {
      ...equipment,
      features_fr,
      features_en,
      features_ar,
      image: equipment.image, // Fetch image separately if needed
    }

    // Cache response
    cache.set(cacheKey, responseData)

    return NextResponse.json({ success: true, data: responseData })
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'équipement (ID: ${params.id}):`, error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  let connection

  try {
    const equipmentId = params.id
    const data = await request.json() as Partial<EquipmentData>

    if (!equipmentId || isNaN(Number(equipmentId))) {
      return NextResponse.json({ error: "ID d'équipement invalide" }, { status: 400 })
    }

    if (
      !data.type_fr ||
      !data.name_fr ||
      !data.description_fr ||
      !data.features_fr ||
      !Array.isArray(data.features_fr) ||
      data.features_fr.length === 0 ||
      (data.features_en && !Array.isArray(data.features_en)) ||
      (data.features_ar && !Array.isArray(data.features_ar)) ||
      (data.image && !isValidBase64Image(data.image))
    ) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 })
    }

    connection = await pool.getConnection()

    const [result] = await connection.execute<mysql.ResultSetHeader>(
      `UPDATE equipment SET 
       type_fr = ?, type_en = ?, type_ar = ?, 
       name_fr = ?, name_en = ?, name_ar = ?, 
       description_fr = ?, description_en = ?, description_ar = ?, 
       image = ?, features_fr = ?, features_en = ?, features_ar = ?
       WHERE id = ?`,
      [
        data.type_fr,
        data.type_en || null,
        data.type_ar || null,
        data.name_fr,
        data.name_en || null,
        data.name_ar || null,
        data.description_fr,
        data.description_en || null,
        data.description_ar || null,
        data.image || null,
        JSON.stringify(sanitizeFeatures(data.features_fr)),
        JSON.stringify(sanitizeFeatures(data.features_en || [])),
        JSON.stringify(sanitizeFeatures(data.features_ar || [])),
        equipmentId,
      ],
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Équipement non trouvé ou aucune modification" }, { status: 404 })
    }

    // Invalidate cache
    cache.del(`equipment:${equipmentId}`)

    return NextResponse.json({
      success: true,
      message: "Équipement mis à jour avec succès",
    })
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'équipement (ID: ${params.id}):`, error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  let connection

  try {
    const equipmentId = params.id

    if (!equipmentId || isNaN(Number(equipmentId))) {
      return NextResponse.json({ error: "ID d'équipement invalide" }, { status: 400 })
    }

    connection = await pool.getConnection()

    const [result] = await connection.execute<mysql.ResultSetHeader>("DELETE FROM equipment WHERE id = ?", [equipmentId])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Équipement non trouvé" }, { status: 404 })
    }

    // Invalidate cache
    cache.del(`equipment:${equipmentId}`)

    return NextResponse.json({
      success: true,
      message: "Équipement supprimé avec succès",
    })
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'équipement (ID: ${params.id}):`, error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}
