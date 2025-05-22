"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, ChevronDown } from "lucide-react"
import Link from "next/link"
import type { Locale } from "@/lib/i18n-config"
import { i18n } from "@/lib/i18n-config"

interface LanguageSwitcherProps {
  currentLang: Locale
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Obtenir le chemin sans le préfixe de langue
  const getPathWithoutLang = () => {
    for (const locale of i18n.locales) {
      if (pathname.startsWith(`/${locale}/`)) {
        return pathname.replace(`/${locale}/`, "/")
      }
      if (pathname === `/${locale}`) {
        return "/"
      }
    }
    return pathname
  }

  const pathWithoutLang = getPathWithoutLang()

  // Obtenir le nom de la langue
  const getLanguageName = (locale: string): string => {
    switch (locale) {
      case "fr":
        return "Français"
      case "en":
        return "English"
      case "ar":
        return "العربية"
      default:
        return locale
    }
  }

  // Obtenir le drapeau de la langue
  const getLanguageFlag = (locale: string): string => {
    switch (locale) {
      case "fr":
        return "🇫🇷"
      case "en":
        return "🇬🇧"
      case "ar":
        return "🇹🇳"
      default:
        return "🌐"
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative">
      <motion.button
        className="flex items-center space-x-1 rounded-full border border-gold/30 bg-background/50 px-3 py-1.5 text-sm text-foreground backdrop-blur-sm transition-colors hover:bg-gold/10"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className="mr-1 h-4 w-4 text-gold" />
        <span>{getLanguageFlag(currentLang)}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 origin-top-right rounded-lg border border-gold/10 bg-background/95 shadow-lg backdrop-blur-md"
          >
            <div className="py-1">
              {i18n.locales.map((locale) => (
                <Link
                  key={locale}
                  href={locale === i18n.defaultLocale && pathWithoutLang === "/" ? "/" : `/${locale}${pathWithoutLang}`}
                  className={`flex items-center px-4 py-2 text-sm transition-colors hover:bg-gold/10 ${
                    locale === currentLang ? "bg-gold/5 font-medium text-gold" : "text-foreground/80"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-2">{getLanguageFlag(locale)} </span>
                  {getLanguageName(locale)}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
