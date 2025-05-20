"use client"

import { useState } from "react"
import type { Dictionary } from "@/lib/dictionaries/types"
import { cn } from "@/lib/utils"

interface BlogFilterProps {
  categories: Dictionary["blogPage"]["categories"];
  onFilterChangeAction: (category: string) => void;
}

export default function BlogFilter({ categories, onFilterChangeAction }: BlogFilterProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    onFilterChangeAction(category);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {Object.entries(categories).map(([key, value]) => (
        <button
          key={key}
          onClick={() => handleCategoryClick(key)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            activeCategory === key
              ? "bg-gold-500 text-white dark:bg-gold-600 dark:text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          )}
        >
          {value}
        </button>
      ))}
    </div>
  );
}
