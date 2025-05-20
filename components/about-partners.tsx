"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { Locale } from "@/lib/i18n-config"

interface AboutPartnersProps {
  dictionary: {
    partnersTitle: string
    partnersSubtitle: string
    partners: {
      name: string
      logo: string
      url?: string
    }[]
  }
  lang: Locale
}

export default function AboutPartners({ dictionary, lang }: AboutPartnersProps) {
  const isRtl = lang === "ar"

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
              {dictionary.partnersTitle}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
          <p className={`text-lg text-muted-foreground ${isRtl ? "font-arabic" : ""}`}>{dictionary.partnersSubtitle}</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4"
        >
          {dictionary.partners.map((partner, index) => (
            <motion.div key={index} variants={item} className="flex items-center justify-center">
              <a
                href={partner.url || "#"}
                target={partner.url ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="group flex h-32 w-full items-center justify-center rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-gold/30 hover:shadow-lg"
              >
                <Image
                  src={partner.logo || `/placeholder.svg?height=80&width=160&text=${partner.name}`}
                  alt={partner.name}
                  width={160}
                  height={80}
                  className="max-h-20 w-auto transition-opacity duration-300 group-hover:opacity-80"
                />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
