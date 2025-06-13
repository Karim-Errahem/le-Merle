"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, UserPlus, Clock, Edit, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"

interface Admin {
  id: number
  full_name: string
  email: string
  role: string
  status: string
  created_at: string
  last_login: string | null
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/admins")
      const data = await response.json()

      if (data.success) {
        setAdmins(data.data)
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger les administrateurs",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      const response = await fetch(`/api/admins/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Succès",
          description: "Administrateur supprimé avec succès",
        })
        fetchAdmins() // Recharger la liste
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de la suppression",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Jamais"
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Administrateurs</h2>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Administrateurs</h2>
        <Button asChild>
          <Link href="/admins/add">
            <UserPlus className="mr-2 h-4 w-4" /> Ajouter un administrateur
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {admins.map((admin) => (
          <Card key={admin.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {admin.full_name}
                    {admin.status === "inactive" && (
                      <Badge variant="secondary" className="text-xs">
                        Inactif
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{admin.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={admin.role === "admin" ? "default" : "outline"}
                    className={admin.role === "admin" ? "bg-[#ffc000]" : ""}
                  >
                    {admin.role === "admin" ? "Administrateur" : "Sous-administrateur"}
                  </Badge>
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/admins/edit/${admin.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          Confirmer la suppression
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer l'administrateur <strong>{admin.full_name}</strong> ? Cette
                          action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(admin.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={deletingId === admin.id}
                        >
                          {deletingId === admin.id ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">Créé le:</span>
                  {formatDate(admin.created_at)}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">Dernière connexion:</span>
                  {formatDate(admin.last_login)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {admins.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun administrateur</h3>
              <p className="text-muted-foreground text-center mb-4">
                Commencez par ajouter votre premier administrateur.
              </p>
              <Button asChild>
                <Link href="/admins/add">
                  <UserPlus className="mr-2 h-4 w-4" /> Ajouter un administrateur
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
