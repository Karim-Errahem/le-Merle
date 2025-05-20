"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"
import DynamicMap from "./dynamic-map"

interface ContactProps {
  dictionary: {
    title: string
    subtitle: string
    locations: {
      name: string
      address: string
      phone: string
      mobile?: string
      email: string
    }[]
    formTitle: string
    nameLabel: string
    emailLabel: string
    messageLabel: string
    submitButton: string
    mapTitle?: string
  }
  lang: Locale
}

export default function Contact({ dictionary, lang }: ContactProps) {
  const isRtl = lang === "ar"
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic would go here
    console.log(formState)
  }

  return (
    <section className="w-full bg-gray-100 py-24 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`mx-auto mb-16 max-w-3xl text-center ${isRtl ? "font-arabic" : ""}`}
        >
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            <span className="relative">
              {dictionary.title}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">{dictionary.subtitle}</p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={`mb-8 ${isRtl ? "font-arabic text-right" : ""}`}>
              <h3 className="mb-6 text-2xl font-bold text-foreground">{dictionary.locations[0].name}</h3>

              <div className="space-y-6">
                {dictionary.locations.map((location, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl border border-gold/10 bg-card p-6 shadow-lg transition-all duration-300 hover:border-gold/30 hover:shadow-gold/5"
                  >
                    <h4 className="mb-4 text-xl font-bold text-card-foreground">{location.name}</h4>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10">
                          <MapPin className="h-4 w-4 text-gold" />
                        </div>
                        <p className="text-muted-foreground">{location.address}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10">
                          <Phone className="h-4 w-4 text-gold" />
                        </div>
                        <p className="text-muted-foreground">{location.phone}</p>
                      </div>

                      {location.mobile && (
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10">
                            <Phone className="h-4 w-4 text-gold" />
                          </div>
                          <p className="text-muted-foreground">{location.mobile}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10">
                          <Mail className="h-4 w-4 text-gold" />
                        </div>
                        <a
                          href={`mailto:${location.email}`}
                          className="text-muted-foreground transition-colors hover:text-gold"
                        >
                          {location.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carte des emplacements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8"
              >
                <h3 className="mb-4 text-xl font-bold text-foreground">{dictionary.mapTitle || "Nos emplacements"}</h3>
                <DynamicMap lang={lang} />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`rounded-xl border border-gold/10 bg-card p-8 shadow-lg ${
              isRtl ? "font-arabic text-right" : ""
            }`}
          >
            <h3 className="mb-6 text-2xl font-bold text-card-foreground">{dictionary.formTitle}</h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
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
                />
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
                ></textarea>
              </div>

              <button
                type="submit"
                className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-gold to-amber-400 px-6 py-3 text-base font-medium text-gray-900 shadow-lg transition-all duration-300 hover:shadow-gold/20"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {dictionary.submitButton}
                  <Send className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
