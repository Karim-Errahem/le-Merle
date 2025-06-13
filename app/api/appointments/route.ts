import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"
import pool from "@/lib/db"


// Pas de changement nécessaire dans la route GET
export async function GET(request: NextRequest) {
  let connection
  try {
    // Get a connection from the pool
    connection = await pool.getConnection()

    const [rows] = await connection.execute(`
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
      ORDER BY
        r.date DESC, r.time ASC
    `)

    return NextResponse.json({ appointments: rows })
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des rendez-vous" }, { status: 500 })
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release()
    }
  }
}