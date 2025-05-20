import type { Dictionary } from "@/lib/dictionaries/types"

interface StatsSectionProps {
  stats: Dictionary["reviewsPage"]["stats"]
}

export default function StatsSection({ stats }: StatsSectionProps) {
  
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">{stats.title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.items.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-gold-600 dark:text-gold-400 mb-2">{item.value}</div>
              <div className="text-gray-600 dark:text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
