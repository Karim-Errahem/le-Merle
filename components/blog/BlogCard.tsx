import Image from "next/image"
import Link from "next/link"
import type { Dictionary } from "@/lib/dictionaries/types"
import type { Locale } from "@/lib/i18n-config"

interface BlogCardProps {
  post: Dictionary["blogPage"]["posts"][0]
  readMore: string
  lang: Locale
}

export default function BlogCard({ post, readMore, lang }: BlogCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{post.date}</span>
          <span className="mx-2">•</span>
          <span>{post.author}</span>
        </div>
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <Link
          href={`/${lang}/blog/${post.slug}`}
          className="inline-flex items-center text-gold-600 hover:text-gold-700"
        >
          {readMore}
          <svg
            className="ml-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
