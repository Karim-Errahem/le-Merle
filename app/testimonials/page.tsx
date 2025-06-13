"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Trash2, Star, Plus, Edit } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

interface Testimonial {
  id: number
  quote: string
  author: string
  star: number
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  // Charger les témoignages depuis l'API
  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials")
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des témoignages:", error)
    } finally {
      setLoading(false)
    }
  }

  // Supprimer un témoignage
  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce témoignage ?")) {
      try {
        const response = await fetch(`/api/testimonials/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setTestimonials(testimonials.filter((t) => t.id !== id))
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Témoignages</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
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
        <h2 className="text-3xl font-bold tracking-tight">Témoignages</h2>
        <Link href="/testimonials/add">
         
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Star className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun témoignage</h3>
            <p className="text-muted-foreground text-center mb-4">
              Lire les Témoignages client.
            </p>
          
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.star ? "text-[#ffc000] fill-[#ffc000]" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                   
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(testimonial.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="border-l-4 border-[#ffc000] pl-4 italic">"{testimonial.quote}"</blockquote>
                <p className="mt-4 text-sm font-medium text-right">— {testimonial.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
