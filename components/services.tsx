"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { Locale } from "@/lib/i18n-config"

interface ServicesProps {
  dictionary: {
    title: string
    services: {
      title: string
      description: string
      image: string
    }[]
  }
  lang: Locale
}

export default function Services({ dictionary, lang }: ServicesProps) {
  const isRtl = lang === "ar"
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="w-full bg-background py-24">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`mb-16 text-center text-3xl font-bold text-foreground md:text-4xl ${isRtl ? "font-arabic" : ""}`}
        >
          <span className="relative">
            {dictionary.title}
            <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
          </span>
        </motion.h2>

        <div className="mx-auto grid max-w-6xl gap-24">
          {dictionary.services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex flex-col gap-8 md:flex-row ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative h-64 w-full overflow-hidden rounded-2xl md:h-auto md:w-1/2">
                <Image
                  src={
                    service.image ||
                    `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(service.title) || "//logo.png"}`
                  }
                  alt={service.title}
                  fill
                  className={`object-cover transition-transform duration-700 ${
                    hoveredIndex === index ? "scale-110" : "scale-100"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:hidden">
                  <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                </div>
              </div>

              <div className={`flex w-full flex-col justify-center md:w-1/2 ${isRtl ? "font-arabic text-right" : ""}`}>
                <h3 className="mb-4 text-2xl font-bold text-foreground">{service.title}</h3>
                <p className="text-lg text-muted-foreground [text-wrap:balance]">{service.description}</p>
                <div className="mt-6">
                
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
