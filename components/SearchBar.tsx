"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Locale } from "@/lib/i18n-config"

interface SearchBarProps {
  placeholder: string
  lang: Locale
}

export default function SearchBar({ placeholder, lang }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/${lang}/search?q=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
      <button
        type="submit"
        className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-400"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  )
}
