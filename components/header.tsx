"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"
import { useState, useEffect } from "react"
import LanguageSwitcher from "./language-switcher"
import ThemeToggle from "./theme-toggle"

interface HeaderProps {
  dictionary: Record<string, any>
  lang: Locale
}

type NavMainKeys = "home" | "services" | "about" | "contact" | "blog" | "Information" | "reviews"
type SubLinkKeys = "services" | "about" | "contact"

export default function Header({ dictionary, lang }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hoveredNav, setHoveredNav] = useState<NavMainKeys | null>(null)
  const isRtl = lang === "ar"

  const mainLinks: NavMainKeys[] = ["home", "services", "about", "contact", "blog", "Information", "reviews"]

  const getNavLabel = (key: NavMainKeys): string => {
    const nav = dictionary.navigation
    return nav?.navigation?.[key] || nav?.[key] || dictionary[key] || key
  }

  const getSubLinks = (key: SubLinkKeys): any[] => {
    const nav = dictionary.navigation
    return nav?.navigation?.subLinks?.[key] || nav?.subLinks?.[key] || []
  }

  const getMainLinkUrl = (key: NavMainKeys): string => {
    if (key === "home") return `/${lang}`
    if (key === "Information") return `/${lang}/info`
    return `/${lang}/${key.toLowerCase()}`
  }

  const getSubLinkUrl = (key: SubLinkKeys, subLink: any): string => {
    const href = subLink.href?.trim() || ""
    if (/^https?:\/\//.test(href)) return href
    return href.startsWith("/") ? `/${lang}${href}` : `/${lang}/${href}`
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const isSubLinkKey = (key: NavMainKeys): key is SubLinkKeys => ["services", "about", "contact"].includes(key)
  const hasSubLinks = (key: NavMainKeys) => isSubLinkKey(key) && getSubLinks(key).length > 0
  const getSubLinkTitle = (subLink: any) => subLink.title || "Link"

  // Animations
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  }

  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur-lg border-b border-[#FFC000]/20 shadow-md sm:top-[40px]">
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4">
        {/* Logo */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={logoVariants}
          transition={{ duration: 0.5 }}
          className="flex items-center h-full flex-shrink-0"
        >
          <Link href={`/${lang}`} className="flex items-center h-full">
            <div className="relative h-12 w-40 sm:h-14 sm:w-48 md:h-16 md:w-52">
              <Image
                src="/logo.png"
                alt="Le Merle Logo"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 640px) 160px, 192px"
              />
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 justify-center max-w-4xl mx-4">
          <motion.ul
            className="flex gap-4 xl:gap-6 justify-center flex-wrap"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            {mainLinks.map((key) => (
              <motion.li
                key={key}
                className="relative"
                onMouseEnter={() => setHoveredNav(key)}
                onMouseLeave={() => setHoveredNav(null)}
                variants={navItemVariants}
              >
                <Link
                  href={getMainLinkUrl(key)}
                  className="group relative text-sm xl:text-base font-medium text-foreground transition-colors px-2 py-1"
                >
                  {getNavLabel(key)}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#FFC000] transition-all duration-300 group-hover:w-full"></span>
                </Link>
                {hasSubLinks(key) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: hoveredNav === key ? 1 : 0, y: hoveredNav === key ? 0 : 10 }}
                    className="absolute top-full mt-2 min-w-[200px] bg-background/95 shadow-lg rounded-lg p-2 backdrop-blur-md border border-[#FFC000]/10"
                  >
                    <div className="flex flex-col gap-1">
                      {getSubLinks(key as SubLinkKeys).map((subLink, idx) => (
                        <Link
                          key={idx}
                          href={getSubLinkUrl(key as SubLinkKeys, subLink)}
                          className="px-3 py-2 rounded-md text-sm hover:bg-[#FFC000]/5 transition-colors text-foreground/80 hover:text-[#FFC000]"
                        >
                          {getSubLinkTitle(subLink)}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.li>
            ))}
          </motion.ul>
        </nav>

        {/* Desktop Controls */}
        <motion.div
          className="hidden lg:flex items-center gap-4 flex-shrink-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LanguageSwitcher currentLang={lang} />
          <ThemeToggle lightMode="Mode clair" darkMode="Mode sombre" />
        </motion.div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-3">
          <LanguageSwitcher currentLang={lang} />
          <ThemeToggle lightMode="Mode clair" darkMode="Mode sombre" />
          <motion.button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FFC000]/30 text-foreground transition-colors hover:bg-[#FFC000]/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-x-0 top-full z-50 bg-background/95 py-4 backdrop-blur-md border-b border-[#FFC000]/10 lg:hidden"
            >
              <nav className="container mx-auto px-4">
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
                    },
                  }}
                  className="flex flex-col gap-3"
                >
                  {mainLinks.map((key) => (
                    <motion.li
                      key={key}
                      variants={{
                        hidden: { x: -20, opacity: 0 },
                        visible: { x: 0, opacity: 1 },
                      }}
                    >
                      <Link
                        href={getMainLinkUrl(key)}
                        className="text-base font-medium text-foreground/90 hover:text-[#FFC000] transition-colors block py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {getNavLabel(key)}
                      </Link>

                      {hasSubLinks(key) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="ml-3 mt-1 flex flex-col gap-2 border-l border-[#FFC000]/10 pl-2"
                        >
                          {getSubLinks(key as SubLinkKeys).map((subLink, idx) => (
                            <Link
                              key={idx}
                              href={getSubLinkUrl(key as SubLinkKeys, subLink)}
                              className="text-sm text-foreground/70 hover:text-[#FFC000] transition-colors py-1.5"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {getSubLinkTitle(subLink)}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}