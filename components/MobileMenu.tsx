"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"
import SearchBar from "./SearchBar"

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
}

export default function MobileMenu({ lang, dictionary, isOpen, onClose }: MobileMenuProps) {
  const [mounted, setMounted] = useState(false)

  // Éviter les erreurs d'hydratation
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
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
          <Link
            href={`/${lang}/services`}
            className="text-xl py-2 border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
            onClick={onClose}
          >
            {dictionary.services}
          </Link>
          <Link
            href={`/${lang}/about`}
            className="text-xl py-2 border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
            onClick={onClose}
          >
            {dictionary.about}
          </Link>
          <Link
            href={`/${lang}/info`}
            className="text-xl py-2 border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
            onClick={onClose}
          >
            {dictionary.info}
          </Link>
          <Link
            href={`/${lang}/blog`}
            className="text-xl py-2 border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
            onClick={onClose}
          >
            {dictionary.blog}
          </Link>
          <Link
            href={`/${lang}/reviews`}
            className="text-xl py-2 border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
            onClick={onClose}
          >
            {dictionary.reviews}
          </Link>
          <Link
            href={`/${lang}/contact`}
            className="text-xl py-2 border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
            onClick={onClose}
          >
            {dictionary.contact}
          </Link>
        </nav>
      </div>
    </div>
  )
}
