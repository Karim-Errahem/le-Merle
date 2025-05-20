"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import type { Locale } from "@/lib/i18n-config"

interface ServiceCTAProps {
  dictionary: {
    ctaTitle: string
    ctaText: string
    ctaButton: string
  }
  lang: Locale
}

export default function ServiceCTA({ dictionary, lang }: ServiceCTAProps) {
  const isRtl = lang === "ar"

  return (
    <section className="w-full bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gold/90 to-amber-500/90 p-8 shadow-xl md:p-12">
          {/* Cercles décoratifs */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5"></div>

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`mb-4 text-3xl font-bold text-white md:text-4xl ${isRtl ? "font-arabic" : ""}`}
            >
              {dictionary.ctaTitle}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`mb-8 text-lg text-white/90 ${isRtl ? "font-arabic" : ""}`}
            >
              {dictionary.ctaText}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center rounded-full bg-white px-8 py-4 text-base font-medium text-gold shadow-lg transition-all hover:bg-gray-100"
              >
                {dictionary.ctaButton}
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
