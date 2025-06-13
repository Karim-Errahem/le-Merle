import { NextResponse } from "next/server"
import mysql from "mysql2/promise"
import pool from "@/lib/db"


export async function GET() {
  let connection

  try {
    // Get a connection from the pool
    connection = await pool.getConnection()

    // Exécution des requêtes en parallèle pour les statistiques
    const [
      messagesResult,
      rendezVousResult,
      administrateursResult,
      servicesResult,
      equipmentsResult,
      teamMembersResult,
      message_last_seven_days,
      pourcentage_messages,
      rendezVous_aujourdhui,
      pourcentage_rendezVous,
      admini_ce_moins,
      pourcentage_admini_ce_moins,
      service_ce_moins,
      pourcentage_service_ce_moins,
      last_team_members,
      pourcentage_team_members,
      last_equipments,
      pourcentage_equipments,
      appointmentsResult,
    ] = await Promise.all([
      connection.execute("SELECT COUNT(*) AS total FROM `contact`"),
      connection.execute("SELECT COUNT(*) AS total FROM `rendivous`"),
      connection.execute("SELECT COUNT(*) as total FROM users"),
      connection.execute("SELECT COUNT(*) as total FROM services"),
      connection.execute("SELECT COUNT(*) as total FROM equipment"),
      connection.execute("SELECT COUNT(*) as total FROM team_members"),
      connection.execute("SELECT COUNT(*) AS total FROM contact WHERE date >= CURDATE() - INTERVAL 7 DAY"),
      connection.execute(
        "SELECT ROUND((COUNT(CASE WHEN date >= CURDATE() - INTERVAL 7 DAY THEN 1 END) / COUNT(*)) * 100, 2) AS pourcentage_7_jours FROM contact"
      ),
      connection.execute("SELECT COUNT(*) AS total_aujourdhui FROM rendivous WHERE date = CURDATE()"),
      connection.execute(
        "SELECT ROUND((COUNT(CASE WHEN date = CURDATE() THEN 1 END) / COUNT(*)) * 100, 2) AS pourcentage_aujourdhui FROM rendivous"
      ),
      connection.execute(
        "SELECT COUNT(*) AS total FROM users WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())"
      ),
      connection.execute(
        "SELECT ROUND((COUNT(CASE WHEN MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) THEN 1 END) / COUNT(*)) * 100, 2) AS pourcentage_admini_ce_moins FROM users"
      ),
      connection.execute(
        "SELECT COUNT(*) AS total_services_mois FROM services WHERE MONTH(date_creation) = MONTH(CURDATE()) AND YEAR(date_creation) = YEAR(CURDATE())"
      ),
      connection.execute(
        "SELECT ROUND((COUNT(CASE WHEN MONTH(date_creation) = MONTH(CURDATE()) AND YEAR(date_creation) = YEAR(CURDATE()) THEN 1 END) / COUNT(*)) * 100, 2) AS pourcentage_ce_mois FROM services"
      ),
      connection.execute(
        "SELECT COUNT(*) AS total_ajoutes_ce_mois FROM team_members WHERE MONTH(date_creation) = MONTH(CURDATE()) AND YEAR(date_creation) = YEAR(CURDATE())"
      ),
      connection.execute(
        "SELECT ROUND((COUNT(CASE WHEN MONTH(date_creation) = MONTH(CURDATE()) AND YEAR(date_creation) = YEAR(CURDATE()) THEN 1 END) / COUNT(*)) * 100, 2) AS pourcentage_ce_mois FROM team_members"
      ),
      connection.execute(
        "SELECT COUNT(*) AS total_ajoutes_ce_mois FROM equipment WHERE MONTH(date_creation) = MONTH(CURDATE()) AND YEAR(date_creation) = YEAR(CURDATE())"
      ),
      connection.execute(
        "SELECT ROUND((COUNT(CASE WHEN MONTH(date_creation) = MONTH(CURDATE()) AND YEAR(date_creation) = YEAR(CURDATE()) THEN 1 END) / COUNT(*)) * 100, 2) AS pourcentage_ce_mois FROM equipment"
      ),
      // Fetch upcoming appointments (limited to 4, ordered by date and time)
      connection.execute(
        `
        SELECT 
          r.id, 
          r.name, 
          r.date, 
          r.time, 
          r.status,
          s.title_fr
        FROM 
          rendivous r
        JOIN 
          services s ON r.service = s.id
        WHERE 
          r.date >= CURDATE()
        ORDER BY
          r.date ASC, r.time ASC
        LIMIT 4
        `
      ),
    ])

    const stats = {
      messages: (messagesResult[0] as any).total || 0,
      rendezVous: (rendezVousResult[0] as any).total || 0,
      administrateurs: (administrateursResult[0] as any).total || 0,
      services: (servicesResult[0] as any).total || 0,
      equipments: (equipmentsResult[0] as any).total || 0,
      teamMembers: (teamMembersResult[0] as any).total || 0,
      message_last_seven_days: (message_last_seven_days[0] as any).total || 0,
      pourcentage_messages: (pourcentage_messages[0] as any).pourcentage_7_jours || 0,
      pourcentage_rendezVous: (pourcentage_rendezVous[0] as any).pourcentage_aujourdhui || 0,
      rendezVous_aujourdhui: (rendezVous_aujourdhui[0] as any).total_aujourdhui || 0,
      administrateurs_ce_moins: (admini_ce_moins[0] as any).total || 0,
      pourcentage_admini_ce_moins: (pourcentage_admini_ce_moins[0] as any).pourcentage_admini_ce_moins || 0,
      service_ce_moins: (service_ce_moins[0] as any).total_services_mois || 0,
      pourcentage_service_ce_moins: (pourcentage_service_ce_moins[0] as any).pourcentage_ce_mois || 0,
      last_team_members: (last_team_members[0] as any).total_ajoutes_ce_mois || 0,
      pourcentage_team_members: (pourcentage_team_members[0] as any).pourcentage_ce_mois || 0,
      last_equipments: (last_equipments[0] as any).total_ajoutes_ce_mois || 0,
      pourcentage_equipments: (pourcentage_equipments[0] as any).pourcentage_ce_mois || 0,
    }

    const appointments = (appointmentsResult[0] as any[]) || []

    return NextResponse.json({
      success: true,
      stats,
      appointments,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des données du tableau de bord:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des données",
        stats: {
          messages: 0,
          rendezVous: 0,
          administrateurs: 0,
          services: 0,
          equipments: 0,
          teamMembers: 0,
          message_last_seven_days: 0,
          pourcentage_messages: 0,
          pourcentage_rendezVous: 0,
          rendezVous_aujourdhui: 0,
          administrateurs_ce_moins: 0,
          pourcentage_admini_ce_moins: 0,
          service_ce_moins: 0,
          pourcentage_service_ce_moins: 0,
          last_team_members: 0,
          pourcentage_team_members: 0,
          last_equipments: 0,
          pourcentage_equipments: 0,
        },
        appointments: [],
      },
      { status: 500 }
    )
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release()
    }
  }
}