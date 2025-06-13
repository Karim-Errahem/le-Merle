import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"
import pool from "@/lib/db"


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  let connection
  try {
    const { id } = params
    const { status } = await request.json()

    // Valider le statut avec les valeurs de l'enum
    if (!["en attente", "Confirmés", "Annulés"].includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 })
    }

    // Get a connection from the pool
    connection = await pool.getConnection()

    await connection.execute("UPDATE rendivous SET status = ? WHERE id = ?", [status, id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rendez-vous:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour du rendez-vous" }, { status: 500 })
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release()
    }
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  let connection
  try {
    const { id } = params

    // Get a connection from the pool
    connection = await pool.getConnection()

    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      `
      SELECT 
        r.id, 
        r.name, 
        r.email, 
        r.phone, 
        r.date, 
        r.time, 
        r.status, 
        s.title_fr, 
        s.title_en, 
        s.title_ar, 
        s.image
      FROM 
        rendivous r
      JOIN 
        services s ON r.service = s.id
      WHERE
        r.id = ?
    `,
      [id],
    )

    if (Array.isArray(rows) && rows.length === 0) {
      return NextResponse.json({ error: "Rendez-vous non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ appointment: rows[0] })
  } catch (error) {
    console.error("Erreur lors de la récupération du rendez-vous:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération du rendez-vous" }, { status: 500 })
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
    const id = Number.parseInt(params.id)

    // Get a connection from the pool
    connection = await pool.getConnection()

    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      "SELECT status FROM rendivous WHERE id = ?",
      [id]
    )

    if (Array.isArray(rows) && rows.length === 0) {
      return NextResponse.json({ error: "Rendez-vous non trouvé" }, { status: 404 })
    }

    if (rows[0].status !== "Annulés") {
      return NextResponse.json({ error: "Seuls les rendez-vous annulés peuvent être supprimés" }, { status: 400 })
    }

    await connection.execute("DELETE FROM rendivous WHERE id = ?", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression du rendez-vous:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression du rendez-vous" }, { status: 500 })
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release()
    }
  }
}