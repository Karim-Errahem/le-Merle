"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import type { Locale } from "@/lib/i18n-config"

interface ServicesListProps {
  dictionary: {
    title: string
    services: {
      title: string
      description: string
      image: string
      features?: string[]
    }[]
  }
  lang: Locale
}

export default function ServicesList({ dictionary, lang }: ServicesListProps) {
  const isRtl = lang === "ar"
  const [activeService, setActiveService] = useState(0)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="w-full bg-background py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className={`text-3xl font-bold text-foreground md:text-4xl ${isRtl ? "font-arabic" : ""}`}>
            <span className="relative">
              {dictionary.title}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-3">
          {/* Navigation des services */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col space-y-2 lg:col-span-1"
          >
            {dictionary.services.map((service, index) => (
              <motion.button
                key={index}
                variants={item}
                className={`group flex items-center rounded-xl border p-4 text-left transition-all duration-300 ${
                  activeService === index
                    ? "border-gold/30 bg-gold/5 shadow-lg"
                    : "border-border bg-card hover:border-gold/20 hover:bg-gold/5"
                } ${isRtl ? "font-arabic text-right" : ""}`}
                onClick={() => setActiveService(index)}
              >
                <div
                  className={`mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                    activeService === index
                      ? "bg-gold text-white"
                      : "bg-muted text-muted-foreground group-hover:bg-gold/20"
                  }`}
                >
                  {index + 1}
                </div>
                <h3 className="text-lg font-medium text-foreground">{service.title}</h3>
              </motion.button>
            ))}
          </motion.div>

          {/* Détails du service */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            key={activeService}
            className="lg:col-span-2"
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <div className="relative h-64 w-full sm:h-80">
                <Image
                  src={
                    dictionary.services[activeService].image ||
                    `/placeholder.svg?height=400&width=800&text=${
                      encodeURIComponent(dictionary.services[activeService].title) || "/placeholder.svg"
                    }`
                  }
                  alt={dictionary.services[activeService].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <h3 className={`text-2xl font-bold text-white ${isRtl ? "font-arabic" : ""}`}>
                    {dictionary.services[activeService].title}
                  </h3>
                </div>
              </div>

              <div className={`p-6 ${isRtl ? "font-arabic text-right" : ""}`}>
                <p className="mb-6 text-lg text-muted-foreground">{dictionary.services[activeService].description}</p>

                {dictionary.services[activeService].features && (
                  <div className="mt-6">
                    <h4 className="mb-4 text-lg font-medium text-foreground">Caractéristiques:</h4>
                    <ul className="space-y-2">
                      {dictionary.services[activeService].features?.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2 text-gold">✓</span>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8">
             
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
