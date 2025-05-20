"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"

interface TestimonialsProps {
  dictionary: {
    title: string
    subtitle: string
    items: {
      quote: string
      author: string
      role: string
      etoile: number  // Nombre d'étoiles (par exemple, 4)
      image?: string
    }[]
  }
  lang: Locale
}

export default function Testimonials({ dictionary, lang }: TestimonialsProps) {
  const isRtl = lang === "ar"
  const [current, setCurrent] = useState(0)
 
  const length = dictionary.items.length


const renderStars = (count: number) => {
  const totalStars = 5
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: totalStars }, (_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 ${
            i < count ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.07 10.101c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
    </div>
  )
}

 

  const nextSlide = () => {
  setCurrent(current === length - 1 ? 0 : current + 1)
}

const prevSlide = () => {
  setCurrent(current === 0 ? length - 1 : current - 1)
}
  

  return (
    <section className="w-full bg-gray-50 py-24 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className={`mb-4 text-3xl font-bold text-foreground md:text-4xl ${isRtl ? "font-arabic" : ""}`}>
            <span className="relative">
              {dictionary.title}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
          <p className={`text-lg text-muted-foreground ${isRtl ? "font-arabic" : ""}`}>{dictionary.subtitle}</p>
        </motion.div>

        <div className="relative mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl bg-card shadow-xl">
            {dictionary.items.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: index === current ? 1 : 0,
                  x: index === current ? 0 : 100,
                  display: index === current ? "block" : "none",
                }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row"
              >
                
                <div className={`flex flex-col justify-center p-8 md:w-3/5 ${isRtl ? "font-arabic text-right" : ""}`}>
                  <Quote className="mb-4 h-10 w-10 text-gold/40" />
                  <p className="mb-6 text-lg italic text-foreground">{testimonial.quote}</p>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      {renderStars(testimonial.etoile)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={prevSlide}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-gold hover:text-white"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              {dictionary.items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    
                    setCurrent(index)
                  }}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === current ? "w-6 bg-gold" : "bg-border hover:bg-gold/50"
                  }`}
                  aria-label={`Aller au témoignage ${index + 1}`}
                ></button>
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-gold hover:text-white"
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
