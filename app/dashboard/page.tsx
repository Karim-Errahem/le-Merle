import { MessageSquare, Calendar, Users, Layers, Package, UserPlus, Activity, Eye } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import mysql from "mysql2/promise"

// Créer un pool de connexions MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10, // Nombre maximum de connexions dans le pool
  waitForConnections: true, // Attendre si toutes les connexions sont utilisées
  queueLimit: 0 // Pas de limite pour les requêtes en attente
})

// Fonction pour récupérer les statistiques directement depuis la base de données
async function getStats() {
  try {
    // Exécution des requêtes en parallèle avec le pool
    const [messagesResult] = await pool.execute("SELECT COUNT(*) AS total FROM `contact`")
    const [rendezVousResult] = await pool.execute("SELECT COUNT(*) AS total FROM `rendivous`")
    const [administrateursResult] = await pool.execute("SELECT COUNT(*) as total FROM users ")
    const [servicesResult] = await pool.execute("SELECT COUNT(*) as total FROM services")
    const [equipmentsResult] = await pool.execute("SELECT COUNT(*) as total FROM equipment")
    const [teamMembersResult] = await pool.execute("SELECT COUNT(*) as total FROM team_members")
    const [message_last_seven_days] = await pool.execute("SELECT COUNT(*) AS total FROM contact WHERE date >= CURDATE() - INTERVAL 7 DAY ")
    const [pourcentage_messages] = await pool.execute(`SELECT ROUND((COUNT(CASE WHEN date >= CURDATE() - INTERVAL 7 DAY THEN 1 END) / COUNT(*)) * 100, 2) AS pourcentage_7_jours FROM contact`)
    const [rendezVous_aujourdhui] = await pool.execute("SELECT COUNT(*) AS total_aujourdhui FROM rendivous WHERE date = CURDATE()")
    const [pourcentage_rendezVous] = await pool.execute(`SELECT ROUND((COUNT(CASE WHEN date = CURDATE() THEN 1 END) / COUNT(*)) * 100, 2) AS pourcentage_aujourdhui FROM rendivous`)
    const [admini_ce_moins] = await pool.execute("SELECT COUNT(*) AS total FROM users WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) ")
    const [pourcentage_admini_ce_moins] = await pool.execute("SELECT ROUND((COUNT(CASE WHEN MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) THEN 1 END) / COUNT(*)) * 100, 2) AS pourcentage_admini_ce_moins FROM users")
    const [service_ce_moins] = await pool.execute("SELECT COUNT(*) AS total_services_mois FROM services WHERE MONTH(date_creation) = MONTH(CURDATE()) AND YEAR(date_creation) = YEAR(CURDATE())")
    const [pourcentage_service_ce_moins] = await pool.execute("SELECT COUNT(*) AS total_services, COUNT(CASE WHEN MONTH(date_creation) = MONTH(CURDATE()) AND YEAR(date_creation) = YEAR(CURDATE()) THEN 1 END) AS services_ce_mois, ROUND((COUNT(CASE WHEN MONTH(date_creation) = MONTH(CURDATE()) AND YEAR(date_creation) = YEAR(CURDATE()) THEN 1 END) / COUNT(*)) * 100, 2) AS pourcentage_ce_mois FROM services")
    const [last_team_members] = await pool.execute("SELECT COUNT(*) AS total_ajoutes_ce_mois FROM team_members WHERE MONTH(date_creation) = MONTH(CURDATE()) AND YEAR(date_creation) = YEAR(CURDATE())")
    const [pourcentage_team_members] = await pool.execute("SELECT COUNT(*) AS total_team_members, COUNT(CASE WHEN MONTH(date_creation) = MONTH(CURDATE()) AND YEAR(date_creation) = YEAR(CURDATE()) THEN 1 END) AS ajoutes_ce_mois, ROUND((COUNT(CASE WHEN MONTH(date_creation) = MONTH(CURDATE()) AND YEAR(date_creation) = YEAR(CURDATE()) THEN 1 END) / COUNT(*)) * 100, 2) AS pourcentage_ce_mois FROM team_members")
    const [last_equipments] = await pool.execute("SELECT COUNT(*) AS total_ajoutes_ce_mois FROM equipment WHERE MONTH(date_creation) = MONTH(CURDATE()) AND YEAR(date_creation) = YEAR(CURDATE())")
    const [pourcentage_equipments] = await pool.execute("SELECT COUNT(*) AS total_equipments, COUNT(CASE WHEN MONTH(date_creation) = MONTH(CURDATE()) AND YEAR(date_creation) = YEAR(CURDATE()) THEN 1 END) AS ajoutes_ce_mois, ROUND((COUNT(CASE WHEN MONTH(date_creation) = MONTH(CURDATE()) AND YEAR(date_creation) = YEAR(CURDATE()) THEN 1 END) / COUNT(*)) * 100, 2) AS pourcentage_ce_mois FROM equipment")

    const stats = {
      messages: (messagesResult as any[])[0]?.total || 0,
      rendezVous: (rendezVousResult as any[])[0]?.total || 0,
      administrateurs: (administrateursResult as any[])[0]?.total || 0,
      services: (servicesResult as any[])[0]?.total || 0,
      equipments: (equipmentsResult as any[])[0]?.total || 0,
      teamMembers: (teamMembersResult as any[])[0]?.total || 0,
      message_last_seven_days: (message_last_seven_days as any[])[0]?.total || 0,
      pourcentage_messages: (pourcentage_messages as any[])[0]?.pourcentage_7_jours || 0,
      pourcentage_rendezVous: (pourcentage_rendezVous as any[])[0]?.pourcentage_aujourdhui || 0,
      rendezVous_aujourdhui: (rendezVous_aujourdhui as any[])[0]?.total_aujourdhui || 0,
      administrateurs_ce_moins: (admini_ce_moins as any[])[0]?.total || 0,
      pourcentage_admini_ce_moins: (pourcentage_admini_ce_moins as any[])[0]?.pourcentage_admini_ce_moins || 0,
      service_ce_moins: (service_ce_moins as any[])[0]?.total_services_mois || 0,
      pourcentage_service_ce_moins: (pourcentage_service_ce_moins as any[])[0]?.pourcentage_ce_mois || 0,
      last_team_members: (last_team_members as any[])[0]?.total_ajoutes_ce_mois || 0,
      pourcentage_team_members: (pourcentage_team_members as any[])[0]?.pourcentage_ce_mois || 0,
      last_equipments: (last_equipments as any[])[0]?.total_ajoutes_ce_mois || 0,
      pourcentage_equipments: (pourcentage_equipments as any[])[0]?.pourcentage_ce_mois || 0
    }

    return stats
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error)
    return {
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
      pourcentage_equipments: 0
    }
  }
}

// Fonction pour récupérer les rendez-vous à venir
async function getUpcomingAppointments() {
  try {
    const [appointments] = await pool.execute(`
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
    `)

    // Mapper les résultats pour correspondre au format attendu
    return (appointments as any[]).map((appt) => {
      const apptDate = new Date(appt.date)
      const today = new Date()
      const isToday =
        apptDate.getDate() === today.getDate() &&
        apptDate.getMonth() === today.getMonth() &&
        apptDate.getFullYear() === today.getFullYear()
      
      // Formater la date et l'heure
      const formattedDate = isToday
        ? `Aujourd'hui, ${appt.time.slice(0, 5)}`
        : `${apptDate.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}, ${appt.time.slice(0, 5)}`

      // Mapper le statut à une priorité (ajustez selon vos valeurs de statut)
      let priority: string
      switch (appt.status.toLowerCase()) {
        case "urgent":
          priority = "high"
          break
        case "normal":
          priority = "medium"
          break
        case "low":
          priority = "low"
          break
        default:
          priority = "medium" // Valeur par défaut
      }

      return {
        name: appt.name,
        service: appt.title_fr,
        date: formattedDate,
        priority: priority,
      }
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous:", error)
    return [
      { name: "Jean Dupont", service: "Consultation", date: "Aujourd'hui, 14:00", priority: "high" },
      { name: "Marie Martin", service: "Évaluation", date: "Demain, 10:30", priority: "medium" },
      { name: "Pierre Leroy", service: "Suivi", date: "23/06/2025, 16:00", priority: "low" },
      { name: "Sophie Bernard", service: "Consultation", date: "25/06/2025, 11:00", priority: "medium" },
    ]
  }
}

export default async function DashboardPage() {
  // Récupération des statistiques et des rendez-vous à venir
const dashboardStats = await getStats()
const appointments = await getUpcomingAppointments()

// Calcul des tendances
const trends = {
  messages: { value: dashboardStats.pourcentage_messages, isPositive: true },
  rendezVous: { value: dashboardStats.pourcentage_rendezVous, isPositive: true },
  administrateurs: { value: dashboardStats.pourcentage_admini_ce_moins, isPositive: true },
  services: { value: dashboardStats.pourcentage_service_ce_moins, isPositive: true },
  equipments: { value: dashboardStats.pourcentage_equipments, isPositive: true },
  teamMembers: { value: dashboardStats.pourcentage_team_members, isPositive: true },
}

  return (
    <div className="flex-1 space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
            Tableau de bord
          </h2>
          <p className="text-muted-foreground mt-2">
            Aperçu de votre activité • Dernière mise à jour: {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            Voir le rapport
          </Button>
          <Button className="gradient-primary text-white shadow-modern gap-2">
            <Activity className="h-4 w-4" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Messages"
          value={dashboardStats.messages.toString()}
          icon={MessageSquare}
          description={dashboardStats.message_last_seven_days.toString() + " messages reçus cette semaine"} 
          trend={trends.messages}
          color="default"
        />
        <StatCard
          title="Rendez-vous"
          value={dashboardStats.rendezVous.toString()}
          icon={Calendar}
          description={dashboardStats.rendezVous_aujourdhui.toString() + " rendez-vous aujourd'hui"}
          trend={trends.rendezVous}
          color="success"
        />
        <StatCard
          title="Administrateurs"
          value={dashboardStats.administrateurs.toString()}
          icon={UserPlus}
          description={dashboardStats.administrateurs_ce_moins.toString() + " nouveaux ce mois"}
          trend={trends.administrateurs}
          color="warning"
        />
        <StatCard
          title="Services"
          value={dashboardStats.services.toString()}
          icon={Layers}
          description={dashboardStats.service_ce_moins.toString() + " services ajoutés ce mois"}
          trend={trends.services}
          color="default"
        />
        <StatCard
          title="Équipements"
          value={dashboardStats.equipments.toString()}
          icon={Package}
          description={dashboardStats.last_equipments.toString() + " ajoutés ce mois"}
          trend={trends.equipments}
          color="success"
        />
        <StatCard
          title="Membres d'équipe"
          value={dashboardStats.teamMembers.toString()}
          icon={Users}
          description={dashboardStats.last_team_members.toString() + " nouveau ce mois"}
          trend={trends.teamMembers}
          color="warning"
        />
      </div>

      {/* Upcoming Appointments */}
      <Card className="gradient-card border-0 shadow-modern-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Calendar className="h-5 w-5 text-[#ffc000]" />
            Rendez-vous à venir
          </CardTitle>
          <CardDescription>Prochains rendez-vous programmés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      item.priority === "high"
                        ? "bg-red-500"
                        : item.priority === "medium"
                          ? "bg-[#ffc000]"
                          : "bg-green-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {item.service}
                      </Badge>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground text-right">{item.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}