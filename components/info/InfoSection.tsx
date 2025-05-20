"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { Dictionary } from "@/lib/dictionaries/types"

interface InfoSectionProps {
  section: Dictionary["infoPage"]["sections"][0]
  lang: "fr" | "ar" | "en" // Ajoutez d'autres langues si nécessaire
}

export default function InfoSection({ section, lang }: InfoSectionProps) {
  const isRtl = lang === "ar"

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className={`text-3xl font-bold text-foreground md:text-4xl ${isRtl ? "font-arabic" : ""}`}>
            <span className="relative inline-block">
              {section.title}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 items-center"
        >
          <motion.div variants={itemVariants} className={`space-y-4 ${isRtl ? "text-right font-arabic" : ""}`}>
            {section.content.map((paragraph, index) => (
              <p key={index} className="text-gray-700 dark:text-gray-300">
                {paragraph}
              </p>
            ))}
          </motion.div>

          {section.image && (
            <motion.div
              variants={itemVariants}
              className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-md"
            >
              <Image
                src={section.image || "/placeholder.svg"}
                alt={section.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
