
import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

// Create MySQL connection
async function createConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
}

// GET - Récupère tous les membres de l'équipe
export async function GET() {
  let connection

  try {
    connection = await createConnection()

    const [rows] = await connection.execute(
      "SELECT `id`, `name`, `role_fr`, `bio_fr`, `name_ar`, `role_ar`, `bio_ar`, `role_en`, `bio_en`, `image` FROM `team_members` ORDER BY `id` DESC",
    )

    return NextResponse.json({
      success: true,
      data: rows,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des membres de l'équipe",
      },
      { status: 500 },
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

// POST - Ajoute un nouveau membre
export async function POST(request: NextRequest) {
  let connection

  try {
    const body = await request.json()
    const { name, role_fr, bio_fr, name_ar, role_ar, bio_ar, role_en, bio_en, image } = body

    // Validation des champs requis
    if (!name || !role_fr || !bio_fr || !role_en || !bio_en || !role_ar || !bio_ar) {
      return NextResponse.json(
        {
          success: false,
          error: "Tous les champs sont requis",
        },
        { status: 400 },
      )
    }

    // Validation de l'image base64 si fournie
    if (image && !image.startsWith("data:image/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Format d'image invalide",
        },
        { status: 400 },
      )
    }

    connection = await createConnection()

    const [result] = await connection.execute(
      "INSERT INTO `team_members`(`name`, `role_fr`, `bio_fr`, `name_ar`, `role_ar`, `bio_ar`, `role_en`, `bio_en`, `image`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, role_fr, bio_fr, name_ar, role_ar, bio_ar, role_en, bio_en, image || null],
    )

    return NextResponse.json({
      success: true,
      message: "Membre ajouté avec succès",
      data: { id: (result as any).insertId },
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'ajout du membre",
      },
      { status: 500 },
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}