"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"

interface WhyChooseUsProps {
  dictionary: {
    title: string
    description: string
    benefits: string[]
    conclusion: string
  }
  lang: Locale
}

export default function WhyChooseUs({ dictionary, lang }: WhyChooseUsProps) {
  const isRtl = lang === "ar"

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
          className={`mx-auto max-w-3xl text-center ${isRtl ? "font-arabic" : ""}`}
        >
          <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
            <span className="relative">
              {dictionary.title}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
          <p className="mb-16 text-lg text-muted-foreground">{dictionary.description}</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto grid max-w-4xl gap-6"
        >
          {dictionary.benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={item}
              className={`flex items-start gap-4 rounded-xl border border-gold/10 bg-card p-6 shadow-lg transition-all duration-300 hover:border-gold/30 hover:shadow-gold/5 ${
                isRtl ? "font-arabic text-right" : ""
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-gold to-amber-300 shadow-md">
                <Check className="h-5 w-5 text-white" />
              </div>
              <p className="text-lg text-card-foreground">{benefit}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`mx-auto mt-16 max-w-3xl text-center text-lg text-muted-foreground ${isRtl ? "font-arabic" : ""}`}
        >
          {dictionary.conclusion}
        </motion.p>
      </div>
    </section>
  )
}
