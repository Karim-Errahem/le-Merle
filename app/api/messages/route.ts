import { NextResponse } from "next/server"
import mysql from "mysql2/promise"
import pool from "@/lib/db"
// Create a connection pool (outside the handler to persist across requests)


export async function GET() {
  let connection

  try {
    // Get a connection from the pool
    connection = await pool.getConnection()

    // Récupérer tous les messages depuis la table contact
    const [rows] = await connection.execute(
      "SELECT `id`, `name`, `email`, `phone`, `message`, `date`, `read` FROM `contact` ORDER BY `date` DESC",
    )

    return NextResponse.json({
      success: true,
      messages: rows,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des messages",
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