"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { Locale } from "@/lib/i18n-config"
import Link from 'next/link';

interface HeroProps {
  dictionary: {
    title: string
    subtitle: string
    cta: string
  }
  lang: Locale
}

export default function Hero({ dictionary, lang }: HeroProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative w-full">
      <div className="absolute inset-0 z-0">
       <video
  className="w-full h-full object-cover brightness-[0.4]"
  autoPlay
  loop
  muted
  playsInline
>
  <source src="/143376-782178665_small.mp4" type="video/mp4" />
  {/* Fallback si le navigateur ne supporte pas la vidéo */}
  Your browser does not support the video tag.
</video>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80"></div>
      </div>
      <div className="container relative z-10 mx-auto flex min-h-[90vh] flex-col items-center justify-center px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1
            className={`mb-6 max-w-4xl bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-5xl lg:text-6xl ${
              lang === "ar" ? "font-arabic" : ""
            }`}
          >
            {dictionary.title}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className={`mb-8 max-w-2xl text-lg text-gray-200 md:text-xl ${lang === "ar" ? "font-arabic" : ""}`}>
            {dictionary.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5, delay: 0.4 }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <Link
    href={`/${lang}/contact`}
    className="group relative inline-block overflow-hidden rounded-full bg-gold px-8 py-3 text-base font-medium text-gray-900 shadow-lg transition-all duration-300 hover:shadow-gold/20"
  >
    <span className="relative z-10">{dictionary.cta}</span>
    <span className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-400 to-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
  </Link>
</motion.div>


        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex h-14 w-8 items-start justify-center rounded-full border-2 border-gold/30 p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
              className="h-2 w-2 rounded-full bg-gold"
            ></motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
