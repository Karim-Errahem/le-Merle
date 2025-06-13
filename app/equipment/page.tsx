
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Equipment {
  id: number
  type_fr: string
  type_en: string
  type_ar: string
  name_fr: string
  name_en: string
  name_ar: string
  description_fr: string
  description_en: string
  description_ar: string
  image: string
  created_at?: string
  features_fr: string[]
  features_en: string[]
  features_ar: string[]
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchEquipment = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/equipment")
      const result = await response.json()

      if (response.ok) {
        setEquipment(result.data)
        setError(null)
      } else {
        setError(result.error || "Erreur lors du chargement des équipements")
      }
    } catch (error) {
      console.error("Erreur:", error)
      setError("Erreur de connexion")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet équipement ?")) {
      return
    }

    try {
      setDeletingId(id)
      const response = await fetch(`/api/equipment/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (response.ok) {
        fetchEquipment()
      } else {
        setError(result.error || "Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Erreur:", error)
      setError("Erreur de connexion")
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    fetchEquipment()
  }, [])

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle>Chargement...</CardTitle>
            </CardHeader>
            <CardContent>
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Équipements</h2>
        <Button asChild>
          <Link href="/equipment/add">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un équipement
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {equipment.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{item.name_fr}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Type: {item.type_fr}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/equipment/edit/${item.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="h-24 w-24 rounded-md overflow-hidden border bg-muted flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name_fr}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=96&width=96"
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      <span className="text-xs">Pas d'image</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Français</h4>
                    <p className="text-sm line-clamp-2">{item.description_fr}</p>
                    <ul className="mt-1 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
                      {(Array.isArray(item.features_fr) ? item.features_fr : []).slice(0, 2).map((feature, index) => (
                        <li key={index} className="line-clamp-1">{feature}</li>
                      ))}
                      {(Array.isArray(item.features_fr) ? item.features_fr : []).length > 2 && (
                        <li className="text-xs text-gray-400">+{(Array.isArray(item.features_fr) ? item.features_fr : []).length - 2} autres</li>
                      )}
                    </ul>
                  </div>
                  {item.description_en && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">English</h4>
                      <p className="text-sm line-clamp-2">{item.description_en}</p>
                      <ul className="mt-1 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
                        {(Array.isArray(item.features_en) ? item.features_en : []).slice(0, 2).map((feature, index) => (
                          <li key={index} className="line-clamp-1">{feature}</li>
                        ))}
                        {(Array.isArray(item.features_en) ? item.features_en : []).length > 2 && (
                          <li className="text-xs text-gray-400">+{(Array.isArray(item.features_en) ? item.features_en : []).length - 2} others</li>
                        )}
                      </ul>
                    </div>
                  )}
                  {item.description_ar && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">العربية</h4>
                      <p className="text-sm line-clamp-2" dir="rtl">{item.description_ar}</p>
                      <ul className="mt-1 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside" dir="rtl">
                        {(Array.isArray(item.features_ar) ? item.features_ar : []).slice(0, 2).map((feature, index) => (
                          <li key={index} className="line-clamp-1">{feature}</li>
                        ))}
                        {(Array.isArray(item.features_ar) ? item.features_ar : []).length > 2 && (
                          <li className="text-xs text-gray-400">+{(Array.isArray(item.features_ar) ? item.features_ar : []).length - 2} أخرى</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {equipment.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Aucun équipement trouvé</p>
            <Button asChild>
              <Link href="/equipment/add">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter le premier équipement
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
