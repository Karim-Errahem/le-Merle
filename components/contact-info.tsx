"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"
import DynamicMap from "./dynamic-map"

interface ContactInfoProps {
  dictionary: {
    locations: {
      name: string
      address: string
      phone: string
      mobile?: string
      email: string
      hours?: string
    }[]
    mapTitle?: string
  }
  lang: Locale
}

export default function ContactInfo({ dictionary, lang }: ContactInfoProps) {
  const isRtl = lang === "ar"

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className={`${isRtl ? "font-arabic text-right" : ""}`}>
        <div className="space-y-6">
          {dictionary.locations.map((location, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gold/10 bg-card p-6 shadow-lg transition-all duration-300 hover:border-gold/30 hover:shadow-gold/5"
            >
              <h3 className="mb-4 text-xl font-bold text-card-foreground">{location.name}</h3>

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

                {location.hours && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10">
                      <Clock className="h-4 w-4 text-gold" />
                    </div>
                    <p className="text-muted-foreground">{location.hours}</p>
                  </div>
                )}
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
  )
}
