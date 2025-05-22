"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { Locale } from "@/lib/i18n-config"
import AnimatedGradientText from "./ui/animated-gradient-text"
import ContactFormRes from "./contact-form-res"

interface HeroProps {
  dictionary: {
    title: string
    subtitle: string
    cta: string
  }
  dictionary1: {
    formTitle: string
    nameLabel: string
    emailLabel: string
    messageLabel: string
    submitButton: string
    successMessage?: string
  }
  lang: Locale
  services: {
    title: string
    description: string
  }[]
}

export default function Hero({ dictionary, lang, services, dictionary1 }: HeroProps) {
  const isRtl = lang === "ar"
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Animation pour changer les services
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentServiceIndex((prev) => (prev + 1) % services.length)
        setIsVisible(true)
      }, 500)
    }, 8000) // Augmenté à 8 secondes pour donner plus de temps pour lire les descriptions

    return () => clearInterval(interval)
  }, [services.length])

  // Variantes pour les animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  const serviceVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  // Effet de parallaxe pour l'arrière-plan
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Vidéo d'arrière-plan avec effet parallaxe */}
      <div className="absolute inset-0 z-0" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
        <video className="h-full w-full object-cover brightness-[0.3]" autoPlay loop muted playsInline>
          <source src="/143376-782178665_small.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Cercles décoratifs avec animation */}
      <motion.div
        className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-[#FFC000]/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      ></motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#FFC000]/5 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      ></motion.div>

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[80vh]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`flex flex-col items-start justify-center ${isRtl ? "font-arabic text-right md:order-2" : ""}`}
          >
            <motion.div variants={itemVariants} className="mb-2">
              <span className="inline-block rounded-full bg-[#FFC000]/20 px-4 py-1 text-sm font-medium text-[#FFC000]">
                Le Merle
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className={`mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl ${isRtl ? "font-arabic" : ""}`}
            >
              <AnimatedGradientText
                text={dictionary.title}
                className="font-bold"
                from="from-[#FFC000]"
                via="via-amber-500"
                to="to-yellow-500"
              />
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className={`mb-8 text-lg text-gray-300 md:text-xl ${isRtl ? "font-arabic" : ""}`}
            >
              {dictionary.subtitle}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mb-12 min-h-[120px] rounded-lg bg-gray-800/50 p-6 backdrop-blur-sm w-full"
            >
              <motion.div
                variants={serviceVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                className="flex"
              >
                <div className="mr-4 h-full w-1 rounded-full bg-[#FFC000] flex-shrink-0 self-stretch"></div>
                <div>
                  <h3 className="text-xl font-semibold text-[#FFC000] mb-2">{services[currentServiceIndex].title}</h3>
                  <p className="text-base text-gray-300 leading-relaxed">{services[currentServiceIndex].description}</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex space-x-4">
              <Link
                href={`/${lang}/contact`}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#FFC000] to-amber-400 px-8 py-3 text-base font-medium text-gray-900 shadow-lg transition-all duration-300 hover:shadow-[#FFC000]/20"
              >
                <span className="relative z-10">{dictionary.cta}</span>
                <motion.span
                  className="absolute bottom-0 left-0 right-0 top-0 bg-white"
                  initial={{ x: "100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </Link>

              <Link
                href={`/${lang}/services`}
                className="group rounded-full border border-white/20 bg-transparent px-8 py-3 text-base font-medium text-white transition-all duration-300 hover:bg-white/10"
              >
                <span className="relative">
                  {lang === "fr" ? "Nos services" : lang === "en" ? "Our services" : "خدماتنا"}
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#FFC000]"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </span>
              </Link>
            </motion.div>
          </motion.div>

          <div className={`${isRtl ? "md:order-1" : ""}`}>
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-[#FFC000]/10 p-6 shadow-xl">
              <ContactFormRes dictionary={dictionary1} lang={lang} />
            </div>
          </div>
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
