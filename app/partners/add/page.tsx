"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AddPartnerPage() {
  const [name, setName] = useState("")
  const [logo, setLogo] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

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
      setLoading(true)
      const response = await fetch("/api/partners", {
        method: "POST",
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
          description: "Partenaire ajouté avec succès",
        })
        router.push("/partners")
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors de l'ajout du partenaire",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du partenaire",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
        <h2 className="text-3xl font-bold tracking-tight">Ajouter un partenaire</h2>
      </div>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informations du partenaire</CardTitle>
            <CardDescription>Ajoutez un nouveau partenaire à votre réseau.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du partenaire *</Label>
              <Input
                id="name"
                placeholder="Nom de l'entreprise partenaire"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
                        alt="Aperçu du logo"
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <Upload className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <p className="text-sm font-medium">
                      {logoPreview ? "Cliquez pour changer" : "Glissez-déposez ou cliquez pour télécharger"}
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, SVG jusqu'à 5MB</p>
                    <p className="text-xs text-muted-foreground">Recommandé: 400x200px</p>
                  </div>
                  <Button type="button" variant="outline" size="sm">
                    {logoPreview ? "Changer le logo" : "Choisir un fichier"}
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
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
