import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"
import pool from "@/lib/db"


// GET - Récupérer tous les partenaires
export async function GET() {
  let connection

  try {
    // Get a connection from the pool
    connection = await pool.getConnection()

    const [rows] = await connection.execute("SELECT `id`, `name`, `logo` FROM `partners` ORDER BY `id` DESC")

    return NextResponse.json({ success: true, data: rows })
  } catch (error) {
    console.error("Erreur lors de la récupération des partenaires:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des partenaires" },
      { status: 500 },
    )
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release()
    }
  }
}

// POST - Ajouter un nouveau partenaire
export async function POST(request: NextRequest) {
  let connection

  try {
    const body = await request.json()
    const { name, logo } = body

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

    const [result] = await connection.execute("INSERT INTO `partners`(`name`, `logo`) VALUES (?, ?)", [
      name.trim(),
      logo,
    ])

    return NextResponse.json({
      success: true,
      message: "Partenaire ajouté avec succès",
      id: (result as any).insertId,
    })
  } catch (error) {
    console.error("Erreur lors de l'ajout du partenaire:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de l'ajout du partenaire" }, { status: 500 })
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release()
    }
  }
}