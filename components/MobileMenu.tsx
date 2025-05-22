"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X, ChevronDown, ChevronRight } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"
import SearchBar from "./SearchBar"

interface DropdownItem {
  label: string
  href: string
}

interface MobileMenuProps {
  lang: Locale
  dictionary: {
    home: string
    services: string
    about: string
    contact: string
    info: string
    blog: string
    reviews: string
    searchPlaceholder: string
  }
  isOpen: boolean
  onClose: () => void
  dropdowns: Record<string, DropdownItem[]>
}

export default function MobileMenu({ lang, dictionary, isOpen, onClose, dropdowns }: MobileMenuProps) {
  const [mounted, setMounted] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  // Éviter les erreurs d'hydratation
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!isOpen) return null

  const toggleSubmenu = (key: string) => {
    setOpenSubmenu(openSubmenu === key ? null : key)
  }

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-y-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <Link href={`/${lang}`} className="text-2xl font-bold text-gold-600 dark:text-gold-400" onClick={onClose}>
            Le Merle
          </Link>
          <button onClick={onClose} className="text-gray-700 dark:text-gray-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <SearchBar placeholder={dictionary.searchPlaceholder} lang={lang} />
        </div>

        <nav className="flex flex-col space-y-4">
          <Link
            href={`/${lang}`}
            className="text-xl py-2 border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
            onClick={onClose}
          >
            {dictionary.home}
          </Link>

          {/* Services avec sous-menu */}
          <div>
            <button
              onClick={() => toggleSubmenu("services")}
              className="flex justify-between items-center w-full text-xl py-2 border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
            >
              {dictionary.services}
              {openSubmenu === "services" ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
            {openSubmenu === "services" && (
              <div className="pl-4 mt-2 space-y-2">
                {dropdowns.services.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="block py-2 text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-400"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* About avec sous-menu */}
          <div>
            <button
              onClick={() => toggleSubmenu("about")}
              className="flex justify-between items-center w-full text-xl py-2 border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
            >
              {dictionary.about}
              {openSubmenu === "about" ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
            {openSubmenu === "about" && (
              <div className="pl-4 mt-2 space-y-2">
                {dropdowns.about.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="block py-2 text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-400"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Info avec sous-menu */}
          <div>
            <button
              onClick={() => toggleSubmenu("info")}
              className="flex justify-between items-center w-full text-xl py-2 border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
            >
              {dictionary.info}
              {openSubmenu === "info" ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
            {openSubmenu === "info" && (
              <div className="pl-4 mt-2 space-y-2">
                {dropdowns.info.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="block py-2 text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-400"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Blog avec sous-menu */}
          <div>
            <button
              onClick={() => toggleSubmenu("blog")}
              className="flex justify-between items-center w-full text-xl py-2 border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
            >
              {dictionary.blog}
              {openSubmenu === "blog" ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
            {openSubmenu === "blog" && (
              <div className="pl-4 mt-2 space-y-2">
                {dropdowns.blog.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="block py-2 text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-400"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Reviews avec sous-menu */}
          <div>
            <button
              onClick={() => toggleSubmenu("reviews")}
              className="flex justify-between items-center w-full text-xl py-2 border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
            >
              {dictionary.reviews}
              {openSubmenu === "reviews" ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
            {openSubmenu === "reviews" && (
              <div className="pl-4 mt-2 space-y-2">
                {dropdowns.reviews.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="block py-2 text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-400"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Contact avec sous-menu */}
          <div>
            <button
              onClick={() => toggleSubmenu("contact")}
              className="flex justify-between items-center w-full text-xl py-2 border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
            >
              {dictionary.contact}
              {openSubmenu === "contact" ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
            {openSubmenu === "contact" && (
              <div className="pl-4 mt-2 space-y-2">
                {dropdowns.contact.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="block py-2 text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-400"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  )
}
