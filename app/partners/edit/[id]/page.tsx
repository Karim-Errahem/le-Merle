"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface Partner {
  id: number
  name: string
  logo: string
}

export default function EditPartnerPage() {
  const params = useParams()
  const router = useRouter()
  const partnerId = params.id as string
  const { toast } = useToast()

  const [partner, setPartner] = useState<Partner | null>(null)
  const [name, setName] = useState("")
  const [logo, setLogo] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchPartner = async () => {
    try {
      const response = await fetch(`/api/partners/${partnerId}`)
      const result = await response.json()

      if (result.success) {
        const partnerData = result.data
        setPartner(partnerData)
        setName(partnerData.name)
        setLogo(partnerData.logo)
        setLogoPreview(partnerData.logo)
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Partenaire non trouvé",
          variant: "destructive",
        })
        router.push("/partners")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement du partenaire",
        variant: "destructive",
      })
      router.push("/partners")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validation du type de fichier
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image valide",
        variant: "destructive",
      })
      return
    }

    // Validation de la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5MB",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setLogo(result)
      setLogoPreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du partenaire est requis",
        variant: "destructive",
      })
      return
    }

    if (!logo) {
      toast({
        title: "Erreur",
        description: "Le logo est requis",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/partners/${partnerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          logo,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Succès",
          description: "Partenaire mis à jour avec succès",
        })
        router.push("/partners")
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors de la mise à jour",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchPartner()
  }, [partnerId])

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href="/partners">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Chargement...</h2>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/partners">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Modifier le partenaire #{partnerId}</h2>
      </div>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informations du partenaire</CardTitle>
            <CardDescription>Modifiez les informations du partenaire.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du partenaire *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label>Logo du partenaire *</Label>
              <div
                className="flex items-center justify-center border-2 border-dashed border-border rounded-md p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-32 w-48 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Logo du partenaire"
                        className="h-full w-full object-contain p-2"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=400"
                        }}
                      />
                    ) : (
                      <Upload className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <p className="text-sm font-medium">Glissez-déposez ou cliquez pour changer</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, SVG jusqu'à 5MB</p>
                    <p className="text-xs text-muted-foreground">Recommandé: 400x200px</p>
                  </div>
                  <Button type="button" variant="outline" size="sm">
                    Changer l'image
                  </Button>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" className="mr-2" asChild>
              <Link href="/partners">Annuler</Link>
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
