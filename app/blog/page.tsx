"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Calendar, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface BlogPost {
  id: number
  title_fr: string
  excerpt_fr: string
  date: string
  author: string
  category: string
  image: string | null
  slug: string
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const limit = 10

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/blog?page=${page}&limit=${limit}&includeImage=true`)
      const result = await response.json()
      if (response.ok) {
   
        setBlogPosts(result.data)
        setError(null)
      } else {
        setError(result.error || "Erreur lors du chargement des articles")
      }
    } catch (err) {
      setError("Erreur de connexion")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [page])

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet article ?")) return
    try {
      const response = await fetch(`/api/blog/${id}`, { method: "DELETE" })
      const result = await response.json()
      if (response.ok) {
        fetchPosts() // Refresh list
      } else {
        alert(result.error || "Erreur lors de la suppression")
      }
    } catch (err) {
      alert("Erreur de connexion")
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Blog</h2>
        <Button asChild>
          <Link href="/blog/add">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un article
          </Link>
        </Button>
      </div>

      {error && <div className="text-red-500">{error}</div>}
      {isLoading && <div>Chargement...</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden flex flex-col">
            <div className="aspect-video w-full overflow-hidden">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title_fr}
                width={600}
                height={300}
                className="h-full w-full object-cover transition-all hover:scale-105"
                placeholder="blur"
                blurDataURL="/placeholder.svg"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="line-clamp-2">{post.title_fr}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <User className="mr-1 h-3 w-3" />
                      {post.author}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt_fr}</p>
            </CardContent>
            <CardFooter className="flex justify-between mt-auto">
             
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/blog/edit/${post.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          onClick={() => setPage((p) => p + 1)}
          disabled={blogPosts.length < limit}
        >
          Suivant
        </Button>
      </div>
    </div>
  )
}