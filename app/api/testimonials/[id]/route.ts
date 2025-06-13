import mysql from "mysql2/promise"
import { type NextRequest, NextResponse } from "next/server"

// GET - Récupère un témoignage spécifique
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    const [rows] = await connection.execute("SELECT `id`, `quote`, `author`, `star` FROM `testimonials` WHERE id = ?", [
      params.id,
    ])

    await connection.end()

    const testimonials = rows as any[]
    if (testimonials.length === 0) {
      return NextResponse.json({ error: "Témoignage non trouvé" }, { status: 404 })
    }

    return NextResponse.json(testimonials[0])
  } catch (error) {
    console.error("Erreur lors de la récupération du témoignage:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération du témoignage" }, { status: 500 })
  }
}

// PUT - Met à jour un témoignage
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { quote, author, star } = body

    // Validation
    if (!quote || !author || !star) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    if (star < 1 || star > 5) {
      return NextResponse.json({ error: "La note doit être entre 1 et 5" }, { status: 400 })
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    const [result] = await connection.execute(
      "UPDATE `testimonials` SET `quote` = ?, `author` = ?, `star` = ? WHERE id = ?",
      [quote, author, star, params.id],
    )

    await connection.end()

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "Témoignage non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ message: "Témoignage mis à jour avec succès" })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du témoignage:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour du témoignage" }, { status: 500 })
  }
}

// DELETE - Supprime un témoignage
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    const [result] = await connection.execute("DELETE FROM `testimonials` WHERE id = ?", [params.id])

    await connection.end()

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "Témoignage non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ message: "Témoignage supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression du témoignage:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression du témoignage" }, { status: 500 })
  }
}
