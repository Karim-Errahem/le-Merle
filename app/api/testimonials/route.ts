import mysql from "mysql2/promise"
import { type NextRequest, NextResponse } from "next/server"

// GET - Récupère tous les témoignages
export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    const [rows] = await connection.execute(
      "SELECT `id`, `quote`, `author`, `star` FROM `testimonials` ORDER BY id DESC",
    )

    await connection.end()

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Erreur lors de la récupération des témoignages:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des témoignages" }, { status: 500 })
  }
}

// POST - Ajoute un nouveau témoignage
export async function POST(request: NextRequest) {
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
      "INSERT INTO `testimonials`(`quote`, `author`, `star`) VALUES (?, ?, ?)",
      [quote, author, star],
    )

    await connection.end()

    return NextResponse.json(
      { message: "Témoignage ajouté avec succès", id: (result as any).insertId },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erreur lors de l'ajout du témoignage:", error)
    return NextResponse.json({ error: "Erreur lors de l'ajout du témoignage" }, { status: 500 })
  }
}
