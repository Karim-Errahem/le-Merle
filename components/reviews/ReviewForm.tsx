"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Star, CheckCircle } from "lucide-react"
import type { Dictionary } from "@/lib/dictionaries/types"
import { cn } from "@/lib/utils"

interface ReviewFormProps {
  dictionary: Dictionary["reviewsPage"]["form"]
}

export default function ReviewForm({ dictionary }: ReviewFormProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simuler l'envoi du formulaire
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Réinitialiser le formulaire et afficher le message de succès
    setFormState({
      name: "",
      email: "",
      message: "",
    })
    setRating(0)
    setIsSubmitting(false)
    setIsSubmitted(true)

    // Masquer le message de succès après 5 secondes
    setTimeout(() => {
      setIsSubmitted(false)
    }, 5000)
  }

  return (
     <section className="w-full bg-gray-100 py-24 dark:bg-gray-900">
      <div className="my-12 max-w-2xl mx-auto">
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="rounded-xl border border-gold/10 bg-card p-8 shadow-lg"
    >
      <h3 className="mb-6 text-2xl font-bold text-card-foreground">{dictionary.title}</h3>
      <p className="text-muted-foreground mb-6">{dictionary.subtitle}</p>

      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-8 text-center dark:bg-green-900/20"
        >
          <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
          <p className="text-lg font-medium text-green-800 dark:text-green-200">
            {dictionary.successMessage || "Votre avis a été envoyé avec succès. Merci pour votre retour !"}
          </p>
        </motion.div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-muted-foreground">
                {dictionary.nameLabel}
              </label>
              <input
                type="text"
                id="name"
                value={formState.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-muted-foreground">
                {dictionary.emailLabel}
              </label>
              <input
                type="email"
                id="email"
                value={formState.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              {dictionary.ratingLabel}
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={cn(
                      "h-8 w-8",
                      star <= (hoveredRating || rating)
                        ? "fill-gold-500 text-gold-500"
                        : "text-gray-300 dark:text-gray-600",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-muted-foreground">
              {dictionary.messageLabel}
            </label>
            <textarea
              id="message"
              rows={5}
              value={formState.message}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              required
              disabled={isSubmitting}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-gold to-amber-400 px-6 py-3 text-base font-medium text-gray-900 shadow-lg transition-all duration-300 hover:shadow-gold/20 disabled:opacity-70"
          >
            <span className="relative z-10 flex items-center justify-center">
              {isSubmitting ? (
                <>
                  <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                <>
                  {dictionary.submitButton}
                </>
              )}
            </span>
          </button>
        </form>
      )}
    </motion.div></div></section>
  )
}
