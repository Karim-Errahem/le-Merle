"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Mail, Phone, User, CheckCircle, XCircle, Loader2, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Appointment {
  id: number
  name: string
  email: string
  phone: string
  date: string
  time: string
  status: "en attente" | "Confirmés" | "Annulés" // Mise à jour pour correspondre à l'enum
  title_fr: string
  title_en: string
  title_ar: string
  image: string | null
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/appointments")

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des rendez-vous")
      }

      const data = await response.json()
      setAppointments(data.appointments)
    } catch (err) {
      console.error("Erreur:", err)
      setError("Impossible de charger les rendez-vous. Veuillez réessayer plus tard.")
    } finally {
      setLoading(false)
    }
  }

  const updateAppointmentStatus = async (id: number, status: "Confirmés" | "Annulés") => {
    try {
      setUpdatingId(id)
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du statut")
      }

      // Mettre à jour l'état local
      setAppointments(
        appointments.map((appointment) => (appointment.id === id ? { ...appointment, status } : appointment)),
      )

      toast({
        title: status === "Confirmés" ? "Rendez-vous confirmé" : "Rendez-vous annulé",
        description: `Le statut du rendez-vous a été mis à jour avec succès.`,
      })
    } catch (err) {
      console.error("Erreur:", err)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du rendez-vous.",
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const deleteAppointment = async (id: number) => {
    try {
      setUpdatingId(id)
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du rendez-vous")
      }

      // Mettre à jour l'état local
      setAppointments(appointments.filter((appointment) => appointment.id !== id))

      toast({
        title: "Rendez-vous supprimé",
        description: "Le rendez-vous a été supprimé avec succès.",
      })
    } catch (err) {
      console.error("Erreur:", err)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le rendez-vous.",
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-gold-600" />
          <p className="mt-2 text-muted-foreground">Chargement des rendez-vous...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchAppointments}>Réessayer</Button>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Rendez-vous</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {appointments.filter((a) => a.status === "en attente").length} rendez-vous en attente
          </span>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="en attente">En attente</TabsTrigger>
          <TabsTrigger value="Confirmés">Confirmés</TabsTrigger>
          <TabsTrigger value="Annulés">Annulés</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4 space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onConfirm={() => updateAppointmentStatus(appointment.id, "Confirmés")}
                onCancel={() => updateAppointmentStatus(appointment.id, "Annulés")}
                onDelete={() => deleteAppointment(appointment.id)}
                isUpdating={updatingId === appointment.id}
              />
            ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">Aucun rendez-vous trouvé</p>
          )}
        </TabsContent>
        <TabsContent value="en attente" className="mt-4 space-y-4">
          {appointments.filter((a) => a.status === "en attente").length > 0 ? (
            appointments
              .filter((a) => a.status === "en attente")
              .map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onConfirm={() => updateAppointmentStatus(appointment.id, "Confirmés")}
                  onCancel={() => updateAppointmentStatus(appointment.id, "Annulés")}
                  onDelete={() => deleteAppointment(appointment.id)}
                  isUpdating={updatingId === appointment.id}
                />
              ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">Aucun rendez-vous en attente</p>
          )}
        </TabsContent>
        <TabsContent value="Confirmés" className="mt-4 space-y-4">
          {appointments.filter((a) => a.status === "Confirmés").length > 0 ? (
            appointments
              .filter((a) => a.status === "Confirmés")
              .map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onConfirm={() => updateAppointmentStatus(appointment.id, "Confirmés")}
                  onCancel={() => updateAppointmentStatus(appointment.id, "Annulés")}
                  onDelete={() => deleteAppointment(appointment.id)}
                  isUpdating={updatingId === appointment.id}
                />
              ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">Aucun rendez-vous confirmé</p>
          )}
        </TabsContent>
        <TabsContent value="Annulés" className="mt-4 space-y-4">
          {appointments.filter((a) => a.status === "Annulés").length > 0 ? (
            appointments
              .filter((a) => a.status === "Annulés")
              .map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onConfirm={() => updateAppointmentStatus(appointment.id, "Confirmés")}
                  onCancel={() => updateAppointmentStatus(appointment.id, "Annulés")}
                  onDelete={() => deleteAppointment(appointment.id)}
                  isUpdating={updatingId === appointment.id}
                />
              ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">Aucun rendez-vous annulé</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AppointmentCard({
  appointment,
  onConfirm,
  onCancel,
  onDelete,
  isUpdating,
}: {
  appointment: Appointment
  onConfirm: () => void
  onCancel: () => void
  onDelete: () => void
  isUpdating: boolean
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en attente":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            En attente
          </Badge>
        )
      case "Confirmés":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Confirmé
          </Badge>
        )
      case "Annulés":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Annulé
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card
      className={
        appointment.status === "en attente"
          ? "border-l-4 border-l-amber-500"
          : appointment.status === "Confirmés"
            ? "border-l-4 border-l-green-500"
            : appointment.status === "Annulés"
              ? "border-l-4 border-l-red-500"
              : ""
      }
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {appointment.name}
              {getStatusBadge(appointment.status)}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Mail className="mr-1 h-3 w-3" />
                {appointment.email}
              </div>
              <div className="flex items-center">
                <Phone className="mr-1 h-3 w-3" />
                {appointment.phone}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {new Date(appointment.date).toISOString().slice(0, 10)}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {appointment.time}
              </div>
              <div className="flex items-center">
                <User className="mr-1 h-3 w-3" />
                {appointment.title_fr}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
              onClick={onConfirm}
              disabled={isUpdating || appointment.status === "Confirmés"}
            >
              {isUpdating ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-1 h-4 w-4" />
              )}
              Confirmer
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={onCancel}
              disabled={isUpdating || appointment.status === "Annulés"}
            >
              {isUpdating ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="mr-1 h-4 w-4" />
              )}
              Annuler
            </Button>
            {appointment.status === "Annulés" && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={onDelete}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-1 h-4 w-4" />
                )}
                Supprimer
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm">
            
          </div>
        </div>
      </CardContent>
    </Card>
  )
}