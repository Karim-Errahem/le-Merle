"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronDown, Globe } from "lucide-react"
import { type Locale, i18n } from "@/lib/i18n-config"

interface LanguageSwitcherProps {
  currentLang: Locale
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const switchLanguage = (locale: Locale) => {
    // Get the path without the current locale
    const pathWithoutLocale = pathname.replace(`/${currentLang}`, "")

    // Navigate to the new locale path
    router.push(`/${locale}${pathWithoutLocale}`)
    setIsOpen(false)
  }

  const languageNames = {
    en: "English",
    fr: "Français",
    ar: "العربية",
  }

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center space-x-2 rounded-full border border-gold/30 px-3 py-2 text-sm text-foreground transition-colors hover:bg-gold/10"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <Globe className="h-4 w-4" />
        <span>{languageNames[currentLang]}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-md border border-gold/30 bg-background shadow-lg ring-1 ring-black ring-opacity-5 transition-all">
          <div className="py-1">
            {i18n.locales.map((locale) => (
              <button
                key={locale}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  locale === currentLang ? "bg-gold/10 text-gold" : "text-foreground hover:bg-gold/5"
                }`}
                onClick={() => switchLanguage(locale)}
                disabled={locale === currentLang}
              >
                {languageNames[locale]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
