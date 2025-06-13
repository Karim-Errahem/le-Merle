import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "default" | "success" | "warning" | "danger"
}

export function StatCard({ title, value, icon: Icon, description, trend, color = "default" }: StatCardProps) {
  const colorClasses = {
    default: "from-[#ffc000] to-[#ffb000]",
    success: "from-emerald-500 to-emerald-600",
    warning: "from-amber-500 to-amber-600",
    danger: "from-red-500 to-red-600",
  }

  return (
    <Card className="gradient-card border-0 shadow-modern-lg hover:shadow-modern-xl transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
        <div
          className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} p-2.5 shadow-modern group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="h-full w-full text-white" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
        <div className="flex items-center justify-between">
          {description && <p className="text-xs text-muted-foreground flex-1">{description}</p>}
          {trend && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                trend.isPositive ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
