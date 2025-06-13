"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface Partner {
  id: number
  name: string
  logo: string
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchPartners = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/partners")
      const result = await response.json()

      if (result.success) {
        setPartners(result.data)
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors du chargement des partenaires",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des partenaires",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le partenaire "${name}" ?`)) {
      return
    }

    try {
      setDeleting(id)
      const response = await fetch(`/api/partners/${id}`, {
        method: "DELETE",
      })
      const result = await response.json()

      if (result.success) {
        toast({
          title: "Succès",
          description: "Partenaire supprimé avec succès",
        })
        fetchPartners()
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
        description: "Erreur lors de la suppression",
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Partenaires</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Partenaires</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchPartners}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Button asChild>
            <Link href="/partners/add">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un partenaire
            </Link>
          </Button>
        </div>
      </div>

      {partners.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Aucun partenaire</h3>
              <p className="text-muted-foreground">Commencez par ajouter votre premier partenaire.</p>
              <Button asChild className="mt-4">
                <Link href="/partners/add">
                  <Plus className="mr-2 h-4 w-4" /> Ajouter un partenaire
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <Card key={partner.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="truncate">{partner.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/partners/edit/${partner.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(partner.id, partner.name)}
                      disabled={deleting === partner.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full overflow-hidden rounded-md border bg-muted">
                  {partner.logo ? (
                    <img
                      src={partner.logo || "/placeholder.svg"}
                      alt={partner.name}
                      className="h-full w-full object-contain p-4"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=100&width=200"
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      Pas de logo
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
