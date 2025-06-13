"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"
import imageCompression from "browser-image-compression"

interface BlogPost {
  id: number
  title_fr: string
  excerpt_fr: string
  title_en: string
  excerpt_en: string
  title_ar: string
  excerpt_ar: string
  date: string
  author: string
  category: string
  image: string | null
  slug: string
}

export default function EditBlogPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id

  const [formData, setFormData] = useState<BlogPost>({
    id: Number(id),
    title_fr: "",
    excerpt_fr: "",
    title_en: "",
    excerpt_en: "",
    title_ar: "",
    excerpt_ar: "",
    date: "",
    author: "",
    category: "",
    image: "",
    slug: "",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${id}?includeImage=true`)
        const result = await response.json()
        if (response.ok) {
          const data = result.data
          setFormData(data)
          setImagePreview(data.image || null)
          setError(null)
        } else {
          setError(result.error || "Erreur lors du chargement de l'article")
        }
      } catch (err) {
        setError("Erreur de connexion")
      }
    }
    fetchPost()
  }, [id])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof BlogPost,
  ) => {
    const value = e.target.value
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "title_fr" && { slug: generateSlug(value) }),
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner un fichier image valide")
      return
    }

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
      })

      const reader = new FileReader()
      reader.onload = (e) => {
        const base64String = e.target?.result as string
        if (base64String.length > 3 * 1024 * 1024) {
          setError("Image trop grande après compression (max 3MB)")
          return
        }
        setImagePreview(base64String)
        setFormData((prev) => ({ ...prev, image: base64String }))
        setError(null)
      }
      reader.onerror = () => setError("Erreur lors de la lecture du fichier")
      reader.readAsDataURL(compressedFile)
    } catch (err) {
      setError("Erreur lors de la compression de l'image")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: `PUT`,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (response.ok) {
        router.push("/blog")
      } else {
        setError(result.error || "Erreur lors de la mise à jour de l'article")
      }
    } catch (err) {
      setError("Erreur de connexion")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Modifier l'article #{id}</h2>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Informations de l'article</CardTitle>
          <CardDescription>Modifiez les informations de l'article en plusieurs langues.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Auteur</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange(e, "author")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange(e, "date")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select onValueChange={handleSelectChange} value={formData.category}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="technology">Technologie</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="development">Développement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange(e, "slug")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Image de couverture</Label>
            <div className="flex items-center justify-center border-2 border-dashed border-border rounded-md p-4">
              <div className="flex flex-col items-center space-y-2">
                <div className="h-32 w-48 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                  {imagePreview || formData.image ? (
                    <img
                      src={imagePreview || formData.image || "/placeholder.svg"}
                      alt="Cover"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Upload className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <p className="text-sm font-medium">Glissez-déposez ou cliquez pour changer</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF jusqu'à 3MB</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <label htmlFor="image-upload">Changer l'image</label>
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>

          <Tabs defaultValue="fr" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="fr">Français</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
            </TabsList>

            <TabsContent value="fr" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title_fr">Titre (FR)</Label>
                <Input
                  id="title_fr"
                  value={formData.title_fr}
                  onChange={(e) => handleInputChange(e, "title_fr")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt_fr">Extrait (FR)</Label>
                <Textarea
                  id="excerpt_fr"
                  value={formData.excerpt_fr}
                  onChange={(e) => handleInputChange(e, "excerpt_fr")}
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="en" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title_en">Title (EN)</Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) => handleInputChange(e, "title_en")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt_en">Excerpt (EN)</Label>
                <Textarea
                  id="excerpt_en"
                  value={formData.excerpt_en}
                  onChange={(e) => handleInputChange(e, "excerpt_en")}
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="ar" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title_ar">العنوان (AR)</Label>
                <Input
                  id="title_ar"
                  value={formData.title_ar}
                  onChange={(e) => handleInputChange(e, "title_ar")}
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt_ar">مقتطف (AR)</Label>
                <Textarea
                  id="excerpt_ar"
                  value={formData.excerpt_ar}
                  onChange={(e) => handleInputChange(e, "excerpt_ar")}
                  rows={3}
                  dir="rtl"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" className="mr-2" asChild>
            <Link href="/blog">Annuler</Link>
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder
            {isLoading && <span>Chargement...</span>}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}