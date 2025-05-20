"use client"

import { motion } from "framer-motion"
import type { Locale } from "@/lib/i18n-config"

interface AboutHistoryProps {
  dictionary: {
    historyTitle: string
    historyText: string
    milestones: {
      year: string
      title: string
      description: string
    }[]
  }
  lang: Locale
}

export default function AboutHistory({ dictionary, lang }: AboutHistoryProps) {
  const isRtl = lang === "ar"

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
              {dictionary.historyTitle}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
          <p className={`text-lg text-muted-foreground ${isRtl ? "font-arabic" : ""}`}>{dictionary.historyText}</p>
        </motion.div>

        <div className="mx-auto max-w-4xl">
          <div className="relative">
            {/* Ligne verticale */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gold/20"></div>

            {dictionary.milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative mb-12 flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className="w-1/2"></div>
                <div className="absolute left-1/2 top-0 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-background bg-gold text-white">
                  {milestone.year}
                </div>
                <div
                  className={`w-1/2 rounded-xl border border-border bg-card p-6 shadow-lg ${
                    isRtl ? "font-arabic text-right" : ""
                  }`}
                >
                  <h3 className="mb-2 text-xl font-bold text-foreground">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
