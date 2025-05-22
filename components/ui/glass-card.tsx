"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
  intensity?: "light" | "medium" | "heavy"
  interactive?: boolean
}

export default function GlassCard({
  children,
  className = "",
  hoverEffect = true,
  intensity = "medium",
  interactive = true,
}: GlassCardProps) {
  // Définir l'intensité de l'effet de verre
  const intensityStyles = {
    light: "bg-white/10 dark:bg-black/10 backdrop-blur-sm border-white/20 dark:border-white/10",
    medium: "bg-white/20 dark:bg-black/20 backdrop-blur-md border-white/30 dark:border-white/20",
    heavy: "bg-white/30 dark:bg-black/30 backdrop-blur-lg border-white/40 dark:border-white/30",
  }

  // Définir les animations de survol
  const hoverVariants = {
    initial: {
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
  }

  return (
    <motion.div
      className={cn(
        "rounded-xl border transition-all duration-300",
        intensityStyles[intensity],
        interactive && "interactive",
        className,
      )}
      initial="initial"
      whileHover={hoverEffect ? "hover" : "initial"}
      variants={hoverVariants}
    >
      {children}
    </motion.div>
  )
}
