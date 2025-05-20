"use client"

import { motion } from "framer-motion"
import type { Locale } from "@/lib/i18n-config"

interface VisionProps {
  dictionary: {
    visionTitle: string
    visionText: string
    missionTitle: string
    missionText: string
    valuesTitle: string
    values: {
      title: string
      description: string
    }[]
  }
  lang: Locale
}

export default function Vision({ dictionary, lang }: VisionProps) {
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
    <section className="w-full bg-gray-900 py-24 text-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={isRtl ? "font-arabic text-right" : ""}
          >
            <div className="mb-6 flex items-center">
              <div className="mr-4 h-10 w-1 rounded-full bg-gradient-to-b from-gold to-amber-300"></div>
              <h2 className="text-3xl font-bold text-white">{dictionary.visionTitle}</h2>
            </div>
            <p className="text-lg text-gray-300 [text-wrap:balance]">{dictionary.visionText}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={isRtl ? "font-arabic text-right" : ""}
          >
            <div className="mb-6 flex items-center">
              <div className="mr-4 h-10 w-1 rounded-full bg-gradient-to-b from-gold to-amber-300"></div>
              <h2 className="text-3xl font-bold text-white">{dictionary.missionTitle}</h2>
            </div>
            <p className="text-lg text-gray-300 [text-wrap:balance]">{dictionary.missionText}</p>
          </motion.div>
        </div>

        <div className={`mx-auto mt-24 max-w-6xl ${isRtl ? "font-arabic text-right" : ""}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="relative inline-block text-3xl font-bold text-white">
              {dictionary.valuesTitle}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </h2>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {dictionary.values.map((value, index) => (
              <motion.div
                key={index}
                variants={item}
                className="group relative overflow-hidden rounded-xl border border-gold/20 bg-gray-800 p-6 shadow-lg transition-all duration-300 hover:border-gold/40 hover:shadow-gold/10"
              >
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gold/5 transition-transform duration-500 group-hover:scale-150"></div>
                <h3 className="relative mb-4 text-xl font-bold text-gold">{value.title}</h3>
                <p className="relative text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
