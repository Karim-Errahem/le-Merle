"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { Locale } from "@/lib/i18n-config"

interface ServiceHeroProps {
  dictionary: {
    title: string
    subtitle: string
  }
  lang: Locale
}

export default function ServiceHero({ dictionary, lang }: ServiceHeroProps) {
  const isRtl = lang === "ar"

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 py-24 md:py-32">
      <div className="absolute inset-0 z-0 opacity-20">
      <video
  className="w-full h-full object-cover brightness-[0.4]"
  autoPlay
  loop
  muted
  playsInline
>
  <source src="/service.mp4" type="video/mp4" />
  {/* Fallback si le navigateur ne supporte pas la vidéo */}
  Your browser does not support the video tag.
</video>
      </div>

      {/* Cercles décoratifs */}
      <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-gold/10 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-gold/5 blur-3xl"></div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className={`mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl ${isRtl ? "font-arabic" : ""}`}>
              {dictionary.title}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className={`text-lg text-gray-300 md:text-xl ${isRtl ? "font-arabic" : ""}`}>{dictionary.subtitle}</p>
          </motion.div>
        </div>
      </div>

      {/* Vague décorative en bas */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="h-auto w-full">
          <path
            fill="currentColor"
            fillOpacity="1"
            className="text-background"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  )
}
