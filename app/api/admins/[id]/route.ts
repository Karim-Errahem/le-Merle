import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"
import bcrypt from "bcryptjs"
import pool from "@/lib/db"


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  let connection

  try {
    const { id } = params

    // Get a connection from the pool
    connection = await pool.getConnection()

    const [rows] = await connection.execute(
      "SELECT `id`, `full_name`, `email`, `role`, `status`, `created_at`, `last_login` FROM `users` WHERE `id` = ?",
      [id],
    )

    const admins = rows as any[]

    if (admins.length === 0) {
      return NextResponse.json({ error: "Administrateur non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: admins[0] })
  } catch (error) {
    console.error("Erreur lors de la récupération de l'administrateur:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release()
    }
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  let connection

  try {
    const { id } = params
    const { full_name, email, password, role, status } = await request.json()

    // Validation des données
    if (!full_name || !email || !role) {
      return NextResponse.json({ error: "Nom, email et rôle sont requis" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 })
    }

    // Get a connection from the pool
    connection = await pool.getConnection()

    // Vérifier si l'administrateur existe
    const [existingAdmin] = await connection.execute("SELECT id FROM users WHERE id = ?", [id])
    if ((existingAdmin as any[]).length === 0) {
      return NextResponse.json({ error: "Administrateur non trouvé" }, { status: 404 })
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const [existingEmail] = await connection.execute("SELECT id FROM users WHERE email = ? AND id != ?", [email, id])
    if ((existingEmail as any[]).length > 0) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 })
    }

    let updateQuery = "UPDATE `users` SET `full_name` = ?, `email` = ?, `role` = ?, `status` = ? WHERE `id` = ?"
    let updateParams = [full_name, email, role, status || "active", id]

    // Si un nouveau mot de passe est fourni
    if (password && password.trim() !== "") {
      if (password.length < 6) {
        return NextResponse.json({ error: "Le mot de passe doit contenir au moins 6 caractères" }, { status: 400 })
      }
      const hashedPassword = await bcrypt.hash(password, 12)
      updateQuery =
        "UPDATE `users` SET `full_name` = ?, `email` = ?, `password` = ?, `role` = ?, `status` = ? WHERE `id` = ?"
      updateParams = [full_name, email, hashedPassword, role, status || "active", id]
    }

    await connection.execute(updateQuery, updateParams)

    return NextResponse.json({
      success: true,
      message: "Administrateur modifié avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la modification de l'administrateur:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release()
    }
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  let connection

  try {
    const { id } = params

    // Get a connection from the pool
    connection = await pool.getConnection()

    // Vérifier si l'administrateur existe
    const [existingAdmin] = await connection.execute("SELECT id FROM users WHERE id = ?", [id])
    if ((existingAdmin as any[]).length === 0) {
      return NextResponse.json({ error: "Administrateur non trouvé" }, { status: 404 })
    }

    // Supprimer l'administrateur
    await connection.execute("DELETE FROM `users` WHERE `id` = ?", [id])

    return NextResponse.json({
      success: true,
      message: "Administrateur supprimé avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'administrateur:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release()
    }
  }
}