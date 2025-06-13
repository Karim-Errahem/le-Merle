import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

// Create a connection pool (outside the handler to persist across requests)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on your needs
  queueLimit: 0,
})

// GET - Récupérer un partenaire spécifique
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  let connection

  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "ID invalide" }, { status: 400 })
    }

    // Get a connection from the pool
    connection = await pool.getConnection()

    const [rows] = await connection.execute("SELECT `id`, `name`, `logo` FROM `partners` WHERE `id` = ?", [id])

    const partners = rows as any[]

    if (partners.length === 0) {
      return NextResponse.json({ success: false, error: "Partenaire non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: partners[0] })
  } catch (error) {
    console.error("Erreur lors de la récupération du partenaire:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la récupération du partenaire" }, { status: 500 })
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release()
    }
  }
}

// PUT - Mettre à jour un partenaire
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  let connection

  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const { name, logo } = body

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "ID invalide" }, { status: 400 })
    }

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Le nom du partenaire est requis" }, { status: 400 })
    }

    if (!logo) {
      return NextResponse.json({ success: false, error: "Le logo est requis" }, { status: 400 })
    }

    // Validation du format base64
    if (!logo.startsWith("data:image/")) {
      return NextResponse.json({ success: false, error: "Le logo doit être une image valide" }, { status: 400 })
    }

    // Get a connection from the pool
    connection = await pool.getConnection()

    const [result] = await connection.execute("UPDATE `partners` SET `name` = ?, `logo` = ? WHERE `id` = ?", [
      name.trim(),
      logo,
      id,
    ])

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Partenaire non trouvé" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Partenaire mis à jour avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du partenaire:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la mise à jour du partenaire" }, { status: 500 })
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release()
    }
  }
}

// DELETE - Supprimer un partenaire
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  let connection

  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "ID invalide" }, { status: 400 })
    }

    // Get a connection from the pool
    connection = await pool.getConnection()

    const [result] = await connection.execute("DELETE FROM `partners` WHERE `id` = ?", [id])

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Partenaire non trouvé" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Partenaire supprimé avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la suppression du partenaire:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la suppression du partenaire" }, { status: 500 })
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release()
    }
  }
}