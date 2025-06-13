import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"
import bcrypt from "bcryptjs"
import pool from "@/lib/db"


export async function GET() {
  let connection

  try {
    // Get a connection from the pool
    connection = await pool.getConnection()

    const [rows] = await connection.execute(
      "SELECT `id`, `full_name`, `email`, `role`, `status`, `created_at`, `last_login` FROM `users` ORDER BY `created_at` DESC",
    )

    return NextResponse.json({ success: true, data: rows })
  } catch (error) {
    console.error("Erreur lors de la récupération des administrateurs:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release()
    }
  }
}

export async function POST(request: NextRequest) {
  let connection

  try {
    const { full_name, email, password, confirm_password, role } = await request.json()

    // Validation des données
    if (!full_name || !email || !password || !role) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    if (password !== confirm_password) {
      return NextResponse.json({ error: "Les mots de passe ne correspondent pas" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 6 caractères" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 })
    }

    // Get a connection from the pool
    connection = await pool.getConnection()

    // Vérifier si l'email existe déjà
    const [existingUsers] = await connection.execute("SELECT id FROM users WHERE email = ?", [email])
    if ((existingUsers as any[]).length > 0) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 })
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Insérer le nouvel administrateur
    const [result] = await connection.execute(
      "INSERT INTO `users`(`full_name`, `email`, `password`, `role`, `status`, `created_at`) VALUES (?, ?, ?, ?, 'active', NOW())",
      [full_name, email, hashedPassword, role],
    )

    const insertResult = result as mysql.ResultSetHeader

    return NextResponse.json({
      success: true,
      message: "Administrateur ajouté avec succès",
      data: { id: insertResult.insertId, full_name, email, role, status: "active" },
    })
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'administrateur:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release()
    }
  }
}