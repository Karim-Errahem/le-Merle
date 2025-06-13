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

// GET - Récupère un membre spécifique
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  let connection

  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "ID invalide",
        },
        { status: 400 },
      )
    }

    connection = await createConnection()

    const [rows] = await connection.execute(
      "SELECT `id`, `name`, `role_fr`, `bio_fr`, `name_ar`, `role_ar`, `bio_ar`, `role_en`, `bio_en`, `image` FROM `team_members` WHERE `id` = ?",
      [id],
    )

    const members = rows as any[]

    if (members.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Membre non trouvé",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: members[0],
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération du membre",
      },
      { status: 500 },
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

// PUT - Met à jour un membre
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  let connection

  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "ID invalide",
        },
        { status: 400 },
      )
    }

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

    // Vérifier si le membre existe
    const [existingRows] = await connection.execute("SELECT `id` FROM `team_members` WHERE `id` = ?", [id])

    if ((existingRows as any[]).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Membre non trouvé",
        },
        { status: 404 },
      )
    }

    // Mettre à jour le membre (sans l'ID dans le SET)
    await connection.execute(
      "UPDATE `team_members` SET `name`=?, `role_fr`=?, `bio_fr`=?, `name_ar`=?, `role_ar`=?, `bio_ar`=?, `role_en`=?, `bio_en`=?, `image`=? WHERE `id`=?",
      [name, role_fr, bio_fr, name_ar, role_ar, bio_ar, role_en, bio_en, image || null, id],
    )

    return NextResponse.json({
      success: true,
      message: "Membre mis à jour avec succès",
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la mise à jour du membre",
      },
      { status: 500 },
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

// DELETE - Supprime un membre
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  let connection

  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "ID invalide",
        },
        { status: 400 },
      )
    }

    connection = await createConnection()

    // Vérifier si le membre existe
    const [existingRows] = await connection.execute("SELECT `id` FROM `team_members` WHERE `id` = ?", [id])

    if ((existingRows as any[]).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Membre non trouvé",
        },
        { status: 404 },
      )
    }

    // Supprimer le membre
    await connection.execute("DELETE FROM `team_members` WHERE `id` = ?", [id])

    return NextResponse.json({
      success: true,
      message: "Membre supprimé avec succès",
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la suppression du membre",
      },
      { status: 500 },
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}