import type { Dictionary } from "@/lib/dictionaries/types"
import type { LucideIcon } from "lucide-react"
import { FileText, Video, Calculator, Calendar } from "lucide-react"
import Link from "next/link"

interface ResourcesListProps {
  resources: Dictionary["infoPage"]["resources"]
}

export default function ResourcesList({ resources }: ResourcesListProps) {
  // Fonction pour obtenir l'icône en fonction du nom
  const getIcon = (iconName: string): LucideIcon => {
    switch (iconName) {
      case "file-text":
        return FileText
      case "video":
        return Video
      case "calculator":
        return Calculator
      case "calendar":
        return Calendar
      default:
        return FileText
    }
  }

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-2 text-center">{resources.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">{resources.subtitle}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.items.map((item, index) => {
            const IconComponent = getIcon(item.icon)
            return (
              <Link
                href={item.link}
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gold-100 dark:bg-gold-900 p-3 rounded-full mb-4">
                    <IconComponent className="h-6 w-6 text-gold-600 dark:text-gold-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
