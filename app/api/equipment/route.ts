
import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function POST(request: NextRequest) {
  let connection

  try {
    const data = await request.json()

    if (!data.type_fr || !data.name_fr || !data.description_fr || !data.features_fr || data.features_fr.length === 0) {
      return NextResponse.json({ error: "Les champs français et au moins une fonctionnalité sont obligatoires" }, { status: 400 })
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    const [result] = await connection.execute(
      `INSERT INTO \`equipment\`(\`type_fr\`, \`type_en\`, \`type_ar\`, \`name_fr\`, \`name_en\`, \`name_ar\`, \`description_fr\`, \`description_en\`, \`description_ar\`, \`image\`, \`features_fr\`, \`features_en\`, \`features_ar\`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.type_fr,
        data.type_en || "",
        data.type_ar || "",
        data.name_fr,
        data.name_en || "",
        data.name_ar || "",
        data.description_fr,
        data.description_en || "",
        data.description_ar || "",
        data.image || "",
        JSON.stringify(data.features_fr || []),
        JSON.stringify(data.features_en || []),
        JSON.stringify(data.features_ar || []),
      ],
    )

    const insertResult = result as mysql.ResultSetHeader

    return NextResponse.json({
      success: true,
      message: "Équipement ajouté avec succès",
      id: insertResult.insertId,
    })
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'équipement:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

export async function GET() {
  let connection

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    const [rows] = await connection.execute(
      "SELECT `id`, `type_fr`, `type_en`, `type_ar`, `name_fr`, `name_en`, `name_ar`, `description_fr`, `description_en`, `description_ar`, `image`, `features_fr`, `features_en`, `features_ar` FROM `equipment`",
    )

    const equipment = (rows as any[]).map((item) => {
      let features_fr = []
      let features_en = []
      let features_ar = []

      try {
        features_fr = item.features_fr ? JSON.parse(item.features_fr) : []
        if (!Array.isArray(features_fr)) features_fr = []
      } catch (e) {
        console.error(`Error parsing features_fr for equipment ${item.id}:`, e)
        features_fr = []
      }

      try {
        features_en = item.features_en ? JSON.parse(item.features_en) : []
        if (!Array.isArray(features_en)) features_en = []
      } catch (e) {
        console.error(`Error parsing features_en for equipment ${item.id}:`, e)
        features_en = []
      }

      try {
        features_ar = item.features_ar ? JSON.parse(item.features_ar) : []
        if (!Array.isArray(features_ar)) features_ar = []
      } catch (e) {
        console.error(`Error parsing features_ar for equipment ${item.id}:`, e)
        features_ar = []
      }

      return {
        ...item,
        features_fr,
        features_en,
        features_ar,
      }
    })

    return NextResponse.json({
      success: true,
      data: equipment,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des équipements:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}
