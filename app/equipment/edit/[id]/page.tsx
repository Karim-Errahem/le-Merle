
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Upload, X, Loader2, Plus } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EquipmentData {
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
  features_fr: string[]
  features_en: string[]
  features_ar: string[]
}

export default function EditEquipmentPage() {
  const params = useParams()
  const router = useRouter()
  const equipmentId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [featuresFr, setFeaturesFr] = useState<string[]>([])
  const [featuresEn, setFeaturesEn] = useState<string[]>([])
  const [featuresAr, setFeaturesAr] = useState<string[]>([])
  const [newFeatureFr, setNewFeatureFr] = useState<string>("")
  const [newFeatureEn, setNewFeatureEn] = useState<string>("")
  const [newFeatureAr, setNewFeatureAr] = useState<string>("")

  const [formData, setFormData] = useState<EquipmentData>({
    id: 0,
    type_fr: "",
    type_en: "",
    type_ar: "",
    name_fr: "",
    name_en: "",
    name_ar: "",
    description_fr: "",
    description_en: "",
    description_ar: "",
    image: "",
    features_fr: [],
    features_en: [],
    features_ar: [],
  })

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setIsLoadingData(true)
        const response = await fetch(`/api/equipment/${equipmentId}`)
        const result = await response.json()

        if (response.ok) {
          setFormData(result.data)
          setFeaturesFr(result.data.features_fr || [])
          setFeaturesEn(result.data.features_en || [])
          setFeaturesAr(result.data.features_ar || [])
          if (result.data.image) {
            setImagePreview(result.data.image)
          }
          setError(null)
        } else {
          setError(result.error || "Erreur lors du chargement de l'équipement")
        }
      } catch (error) {
        console.error("Erreur:", error)
        setError("Erreur de connexion")
      } finally {
        setIsLoadingData(false)
      }
    }

    if (equipmentId) {
      fetchEquipment()
    }
  }, [equipmentId])

  const handleInputChange = (field: keyof EquipmentData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner un fichier image valide")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64String = e.target?.result as string
      setImagePreview(base64String)
      setFormData((prev) => ({
        ...prev,
        image: base64String,
      }))
      setError(null)
    }
    reader.onerror = () => {
      setError("Erreur lors de la lecture du fichier")
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    setFormData((prev) => ({
      ...prev,
      image: "",
    }))
  }

  const addFeature = (lang: "fr" | "en" | "ar") => {
    if (lang === "fr" && newFeatureFr.trim()) {
      const updatedFeatures = [...featuresFr, newFeatureFr.trim()]
      setFeaturesFr(updatedFeatures)
      setFormData((prev) => ({ ...prev, features_fr: updatedFeatures }))
      setNewFeatureFr("")
    } else if (lang === "en" && newFeatureEn.trim()) {
      const updatedFeatures = [...featuresEn, newFeatureEn.trim()]
      setFeaturesEn(updatedFeatures)
      setFormData((prev) => ({ ...prev, features_en: updatedFeatures }))
      setNewFeatureEn("")
    } else if (lang === "ar" && newFeatureAr.trim()) {
      const updatedFeatures = [...featuresAr, newFeatureAr.trim()]
      setFeaturesAr(updatedFeatures)
      setFormData((prev) => ({ ...prev, features_ar: updatedFeatures }))
      setNewFeatureAr("")
    }
  }

  const removeFeature = (lang: "fr" | "en" | "ar", index: number) => {
    if (lang === "fr") {
      const updatedFeatures = featuresFr.filter((_, i) => i !== index)
      setFeaturesFr(updatedFeatures)
      setFormData((prev) => ({ ...prev, features_fr: updatedFeatures }))
    } else if (lang === "en") {
      const updatedFeatures = featuresEn.filter((_, i) => i !== index)
      setFeaturesEn(updatedFeatures)
      setFormData((prev) => ({ ...prev, features_en: updatedFeatures }))
    } else if (lang === "ar") {
      const updatedFeatures = featuresAr.filter((_, i) => i !== index)
      setFeaturesAr(updatedFeatures)
      setFormData((prev) => ({ ...prev, features_ar: updatedFeatures }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!formData.type_fr || !formData.name_fr || !formData.description_fr || formData.features_fr.length === 0) {
      setError("Veuillez remplir tous les champs français obligatoires et ajouter au moins une fonctionnalité")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/equipment/${equipmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/equipment")
        }, 2000)
      } else {
        setError(result.error || "Erreur lors de la mise à jour de l'équipement")
      }
    } catch (error) {
      console.error("Erreur:", error)
      setError("Erreur de connexion")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle>Chargement...</CardTitle>
              <CardDescription>Récupération des données de l'équipement</CardDescription>
            </CardHeader>
            <CardContent>
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="text-green-600">✅ Équipement mis à jour !</CardTitle>
              <CardDescription>L'équipement a été modifié avec succès. Redirection en cours...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/equipment">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Modifier l'équipement #{equipmentId}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'équipement</CardTitle>
            <CardDescription>Modifiez les informations de l'équipement en plusieurs langues.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>Image de l'équipement</Label>
              {imagePreview ? (
                <div className="relative">
                  <div className="flex items-center justify-center border-2 border-dashed border-border rounded-md p-4">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="h-32 w-32 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={isLoading}
                          />
                          <Button type="button" variant="outline" size="sm" disabled={isLoading}>
                            Changer l'image
                          </Button>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={removeImage} className="gap-2">
                          <X className="h-4 w-4" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center border-2 border-dashed border-border rounded-md p-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="h-32 w-32 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <p className="text-sm font-medium">Glissez-déposez ou cliquez pour télécharger</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG jusqu'à 5MB</p>
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isLoading}
                      />
                      <Button type="button" variant="outline" size="sm" disabled={isLoading}>
                        Choisir un fichier
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Tabs defaultValue="fr" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="fr">Français</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ar">العربية</TabsTrigger>
              </TabsList>

              <TabsContent value="fr" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type_fr">Type (FR) *</Label>
                    <Input
                      id="type_fr"
                      placeholder="Type d'équipement en français"
                      value={formData.type_fr}
                      onChange={(e) => handleInputChange("type_fr", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name_fr">Nom (FR) *</Label>
                    <Input
                      id="name_fr"
                      placeholder="Nom de l'équipement en français"
                      value={formData.name_fr}
                      onChange={(e) => handleInputChange("name_fr", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_fr">Description (FR) *</Label>
                  <Textarea
                    id="description_fr"
                    placeholder="Description de l'équipement en français"
                    rows={5}
                    value={formData.description_fr}
                    onChange={(e) => handleInputChange("description_fr", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Fonctionnalités (FR) *</Label>
                  <div className="space-y-2">
                    {featuresFr.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/50 dark:bg-white/5 rounded-md"
                      >
                        <span className="text-sm">{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-red-50 hover:text-red-600"
                          onClick={() => removeFeature("fr", index)}
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ajouter une fonctionnalité en français"
                      value={newFeatureFr}
                      onChange={(e) => setNewFeatureFr(e.target.value)}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      onClick={() => addFeature("fr")}
                      className="gradient-primary text-white shadow-modern"
                      disabled={!newFeatureFr.trim() || isLoading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="en" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type_en">Type (EN)</Label>
                    <Input
                      id="type_en"
                      placeholder="Equipment type in English"
                      value={formData.type_en}
                      onChange={(e) => handleInputChange("type_en", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name_en">Name (EN)</Label>
                    <Input
                      id="name_en"
                      placeholder="Equipment name in English"
                      value={formData.name_en}
                      onChange={(e) => handleInputChange("name_en", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_en">Description (EN)</Label>
                  <Textarea
                    id="description_en"
                    placeholder="Equipment description in English"
                    rows={5}
                    value={formData.description_en}
                    onChange={(e) => handleInputChange("description_en", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Features (EN)</Label>
                  <div className="space-y-2">
                    {featuresEn.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/50 dark:bg-white/5 rounded-md"
                      >
                        <span className="text-sm">{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-red-50 hover:text-red-600"
                          onClick={() => removeFeature("en", index)}
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a feature in English"
                      value={newFeatureEn}
                      onChange={(e) => setNewFeatureEn(e.target.value)}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      onClick={() => addFeature("en")}
                      className="gradient-primary text-white shadow-modern"
                      disabled={!newFeatureEn.trim() || isLoading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ar" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type_ar">النوع (AR)</Label>
                    <Input
                      id="type_ar"
                      placeholder="نوع المعدات بالعربية"
                      dir="rtl"
                      value={formData.type_ar}
                      onChange={(e) => handleInputChange("type_ar", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name_ar">الاسم (AR)</Label>
                    <Input
                      id="name_ar"
                      placeholder="اسم المعدات بالعربية"
                      dir="rtl"
                      value={formData.name_ar}
                      onChange={(e) => handleInputChange("name_ar", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_ar">الوصف (AR)</Label>
                  <Textarea
                    id="description_ar"
                    placeholder="وصف المعدات بالعربية"
                    rows={5}
                    dir="rtl"
                    value={formData.description_ar}
                    onChange={(e) => handleInputChange("description_ar", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-3">
                  <Label>الميزات (AR)</Label>
                  <div className="space-y-2">
                    {featuresAr.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/50 dark:bg-white/5 rounded-md"
                      >
                        <span className="text-sm">{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-red-50 hover:text-red-600"
                          onClick={() => removeFeature("ar", index)}
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="إضافة ميزة بالعربية"
                      value={newFeatureAr}
                      onChange={(e) => setNewFeatureAr(e.target.value)}
                      className="flex-1"
                      dir="rtl"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      onClick={() => addFeature("ar")}
                      className="gradient-primary text-white shadow-modern"
                      disabled={!newFeatureAr.trim() || isLoading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" className="mr-2" asChild disabled={isLoading}>
              <Link href="/equipment">Annuler</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
