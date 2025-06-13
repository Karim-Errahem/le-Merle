"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Upload, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
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

export default function EditTeamMemberPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const memberId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    role_fr: "",
    bio_fr: "",
    name_ar: "",
    role_ar: "",
    bio_ar: "",
    role_en: "",
    bio_en: "",
    image: "",
  })

  const fetchMember = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/team/${memberId}`)
      const result = await response.json()

      if (result.success) {
        const member = result.data
        setFormData({
          name: member.name || "",
          role_fr: member.role_fr || "",
          bio_fr: member.bio_fr || "",
          name_ar: member.name_ar || "",
          role_ar: member.role_ar || "",
          bio_ar: member.bio_ar || "",
          role_en: member.role_en || "",
          bio_en: member.bio_en || "",
          image: member.image || "",
        })
        if (member.image) {
          setImagePreview(member.image)
        }
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Membre non trouvé",
          variant: "destructive",
        })
        router.push("/team")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive",
      })
      router.push("/team")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validation du fichier
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image valide",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5MB",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      setImagePreview(base64)
      setFormData((prev) => ({
        ...prev,
        image: base64,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (
      !formData.name ||
      !formData.role_fr ||
      !formData.bio_fr ||
      !formData.role_en ||
      !formData.bio_en ||
      !formData.role_ar ||
      !formData.bio_ar
    ) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont requis",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/team/${memberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Succès",
          description: "Membre mis à jour avec succès",
        })
        router.push("/team")
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
        description: "Erreur de connexion",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchMember()
  }, [memberId])

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
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/team">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Modifier le membre #{memberId}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations du membre</CardTitle>
            <CardDescription>Modifiez les informations du membre d'équipe en plusieurs langues.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Photo de profil</Label>
              <div className="flex items-center justify-center border-2 border-dashed border-border rounded-md p-4">
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Upload className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <p className="text-sm font-medium">Glissez-déposez ou cliquez pour changer</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG jusqu'à 5MB</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" asChild>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      Changer la photo
                    </label>
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nom complet du membre"
                required
              />
            </div>

            <Tabs defaultValue="fr" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="fr">Français</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ar">العربية</TabsTrigger>
              </TabsList>

              <TabsContent value="fr" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role_fr">Rôle (FR)</Label>
                  <Input
                    id="role_fr"
                    value={formData.role_fr}
                    onChange={(e) => handleInputChange("role_fr", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio_fr">Biographie (FR)</Label>
                  <Textarea
                    id="bio_fr"
                    value={formData.bio_fr}
                    onChange={(e) => handleInputChange("bio_fr", e.target.value)}
                    rows={5}
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="en" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role_en">Role (EN)</Label>
                  <Input
                    id="role_en"
                    value={formData.role_en}
                    onChange={(e) => handleInputChange("role_en", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio_en">Biography (EN)</Label>
                  <Textarea
                    id="bio_en"
                    value={formData.bio_en}
                    onChange={(e) => handleInputChange("bio_en", e.target.value)}
                    rows={5}
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="ar" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name_ar">الاسم (AR)</Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => handleInputChange("name_ar", e.target.value)}
                    dir="rtl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role_ar">الدور (AR)</Label>
                  <Input
                    id="role_ar"
                    value={formData.role_ar}
                    onChange={(e) => handleInputChange("role_ar", e.target.value)}
                    dir="rtl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio_ar">السيرة الذاتية (AR)</Label>
                  <Textarea
                    id="bio_ar"
                    value={formData.bio_ar}
                    onChange={(e) => handleInputChange("bio_ar", e.target.value)}
                    rows={5}
                    dir="rtl"
                    required
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="button" variant="outline" className="mr-2" asChild>
              <Link href="/team">Annuler</Link>
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Sauvegarder
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
