"use client"

import { useState } from "react"
import type { Dictionary } from "@/lib/dictionaries/types"
import type { Locale } from "@/lib/i18n-config"
import BlogCard from "./BlogCard"
import BlogFilter from "./BlogFilter"

interface BlogListProps {
  dictionary: Dictionary["blogPage"]
  lang: Locale
}

export default function BlogList({ dictionary, lang }: BlogListProps) {
  const [filteredPosts, setFilteredPosts] = useState(dictionary.posts)

  const handleFilterChange = (category: string) => {
    if (category === "all") {
      setFilteredPosts(dictionary.posts)
    } else {
      setFilteredPosts(dictionary.posts.filter((post) => post.category === category))
    }
  }

  return (
    
    <div>
      <BlogFilter categories={dictionary.categories} onFilterChange={handleFilterChange} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post, index) => (
          <BlogCard key={index} post={post} readMore={dictionary.readMore} lang={lang} />
        ))}
      </div>
    </div>
  )
}
