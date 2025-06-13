"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, RefreshCw, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface TeamMember {
  id: number
  name: string
  role_fr: string
  bio_fr: string
  name_ar: string
  role_ar: string
  bio_ar: string
  role_en: string
  bio_en: string
  image?: string
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/team")
      const result = await response.json()

      if (result.success) {
        setMembers(result.data)
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors du chargement des membres",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      return
    }

    try {
      setDeleting(id)
      const response = await fetch(`/api/team/${id}`, {
        method: "DELETE",
      })
      const result = await response.json()

      if (result.success) {
        toast({
          title: "Succès",
          description: "Membre supprimé avec succès",
        })
        fetchMembers()
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors de la suppression",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Équipe</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchMembers}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Button asChild>
            <Link href="/team/add">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un membre
            </Link>
          </Button>
        </div>
      </div>

      {members.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground mb-4">Aucun membre d'équipe trouvé</p>
            <Button asChild>
              <Link href="/team/add">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter le premier membre
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-muted">
                      {member.image ? (
                        <img
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=64&width=64"
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{member.role_fr}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/team/edit/${member.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDelete(member.id)}
                      disabled={deleting === member.id}
                    >
                      {deleting === member.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
             
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
