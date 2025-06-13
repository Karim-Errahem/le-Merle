import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function GET() {
  let connection

  try {
    // Création de la connexion à la base de données
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    // Exécution de toutes les requêtes en parallèle
    const [
      messagesResult,
      rendezVousResult,
      administrateursResult,
      servicesResult,
      equipmentsResult,
      teamMembersResult,
    ] = await Promise.all([
      connection.execute("SELECT COUNT(*) AS total FROM `contact`"),
      connection.execute("SELECT COUNT(*) AS total FROM `rendivous`"),
      connection.execute("SELECT COUNT(*) AS total FROM `users`"),
      connection.execute("SELECT COUNT(*) AS total FROM `services`"),
      connection.execute("SELECT COUNT(*) AS total FROM `equipment`"),
      connection.execute("SELECT COUNT(*) AS total FROM `team_members`"),
    ])

    // Extraction des résultats
    const stats = {
      messages: (messagesResult[0] as any[])[0]?.total || 0,
      rendezVous: (rendezVousResult[0] as any[])[0]?.total || 0,
      administrateurs: (administrateursResult[0] as any[])[0]?.total || 0,
      services: (servicesResult[0] as any[])[0]?.total || 0,
      equipments: (equipmentsResult[0] as any[])[0]?.total || 0,
      teamMembers: (teamMembersResult[0] as any[])[0]?.total || 0,
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  } finally {
    // Fermer la connexion
    if (connection) {
      await connection.end()
    }
  }
}
