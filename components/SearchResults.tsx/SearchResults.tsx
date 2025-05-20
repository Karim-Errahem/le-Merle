"use client"

import { useEffect, useState } from "react"
import type { Dictionary } from "@/lib/dictionaries/types"
import type { Locale } from "@/lib/i18n-config"
import Link from "next/link"
import Image from "next/image"
import { User, Calendar, Tag } from "lucide-react"

interface SearchResultsProps {
  query: string
  dictionary: Dictionary
  lang: Locale
}

// Type pour les résultats de recherche
interface SearchResult {
  id: string
  title: string
  excerpt: string
  type: "service" | "blog" | "team" | "faq"
  url: string
  image?: string
  metadata?: {
    [key: string]: string
  }
}

export default function SearchResults({ query, dictionary, lang }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler une recherche avec un délai
    setLoading(true)
    const timer = setTimeout(() => {
      // Recherche dans les services
      const serviceResults = dictionary.services.services
        .filter(
          (service) =>
            service.title.toLowerCase().includes(query.toLowerCase()) ||
            service.description.toLowerCase().includes(query.toLowerCase()),
        )
        .map(
          (service): SearchResult => ({
            id: `service-${service.title}`,
            title: service.title,
            excerpt: service.description.substring(0, 150) + "...",
            type: "service",
            url: `/${lang}/services#${service.title.toLowerCase().replace(/\s+/g, "-")}`,
            image: service.image,
          }),
        )

      // Recherche dans les articles de blog
      const blogResults = dictionary.blogPage.posts
        .filter(
          (post) =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(query.toLowerCase()),
        )
        .map(
          (post): SearchResult => ({
            id: `blog-${post.slug}`,
            title: post.title,
            excerpt: post.excerpt,
            type: "blog",
            url: `/${lang}/blog/${post.slug}`,
            image: post.image,
            metadata: {
              author: post.author,
              date: post.date,
              category:
                dictionary.blogPage.categories[post.category as keyof typeof dictionary.blogPage.categories] ||
                post.category,
            },
          }),
        )

      // Recherche dans l'équipe
      const teamResults = dictionary.aboutPage.members
        .filter(
          (member) =>
            member.name.toLowerCase().includes(query.toLowerCase()) ||
            member.bio.toLowerCase().includes(query.toLowerCase()),
        )
        .map(
          (member): SearchResult => ({
            id: `team-${member.name}`,
            title: member.name,
            excerpt: member.bio,
            type: "team",
            url: `/${lang}/about#team`,
            image: member.image,
            metadata: {
              role: member.role,
            },
          }),
        )

      // Recherche dans les FAQs
      const faqResults = dictionary.contactPage.faqs
        .filter(
          (faq) =>
            faq.question.toLowerCase().includes(query.toLowerCase()) ||
            faq.answer.toLowerCase().includes(query.toLowerCase()),
        )
        .map(
          (faq): SearchResult => ({
            id: `faq-${faq.question}`,
            title: faq.question,
            excerpt: faq.answer,
            type: "faq",
            url: `/${lang}/contact#faq`,
          }),
        )

      // Combiner tous les résultats
      setResults([...serviceResults, ...blogResults, ...teamResults, ...faqResults])
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [query, dictionary, lang])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">{dictionary.searchPage.noResults}</h3>
        <p className="text-gray-600 dark:text-gray-400">{dictionary.searchPage.tryAgain}</p>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        {dictionary.searchPage.resultsFor.replace("{query}", query).replace("{count}", results.length.toString())}
      </p>

      <div className="space-y-8">
        {results.map((result) => (
          <div key={result.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              {result.image && (
                <div className="md:flex-shrink-0 h-48 md:h-auto md:w-48 relative">
                  <Image src={result.image || "/placeholder.svg"} alt={result.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="uppercase tracking-wide text-sm text-gold-600 dark:text-gold-400 font-semibold mb-1">
                  {dictionary.searchPage.resultTypes[result.type]}
                </div>
                <Link
                  href={result.url}
                  className="block mt-1 text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-gold-600 dark:hover:text-gold-400"
                >
                  {result.title}
                </Link>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{result.excerpt}</p>

                {result.metadata && (
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    {result.metadata.author && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {result.metadata.author}
                      </div>
                    )}
                    {result.metadata.date && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {result.metadata.date}
                      </div>
                    )}
                    {result.metadata.category && (
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        {result.metadata.category}
                      </div>
                    )}
                    {result.metadata.role && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {result.metadata.role}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
