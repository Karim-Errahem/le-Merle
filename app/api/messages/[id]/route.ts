import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"
import pool from "@/lib/db"
// Create a connection pool (outside the handler to persist across requests)


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  let connection

  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ success: false, error: "ID du message requis" }, { status: 400 })
    }

    // Get a connection from the pool
    connection = await pool.getConnection()

    // Supprimer le message
    const [result] = await connection.execute("DELETE FROM `contact` WHERE `id` = ?", [id])

    const deleteResult = result as mysql.ResultSetHeader

    if (deleteResult.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Message non trouvé" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Message supprimé avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la suppression du message:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la suppression du message",
      },
      { status: 500 },
    )
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
    const id = params.id
    const { read } = await request.json()

    if (!id) {
      return NextResponse.json({ success: false, error: "ID du message requis" }, { status: 400 })
    }

    // Get a connection from the pool
    connection = await pool.getConnection()

    // Marquer le message comme lu/non lu
    const [result] = await connection.execute("UPDATE `contact` SET `read` = ? WHERE `id` = ?", [read ? 1 : 0, id])

    const updateResult = result as mysql.ResultSetHeader

    if (updateResult.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Message non trouvé" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Statut du message mis à jour avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du message:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la mise à jour du message",
      },
      { status: 500 },
    )
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release()
    }
  }
}