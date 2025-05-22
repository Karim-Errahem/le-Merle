"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedGradientTextProps {
  text: string
  className?: string
  from?: string
  via?: string
  to?: string
  duration?: number
  animate?: boolean
}

export default function AnimatedGradientText({
  text,
  className = "",
  from = "from-gold",
  via = "via-amber-500",
  to = "to-yellow-500",
  duration = 8,
  animate = true,
}: AnimatedGradientTextProps) {
  return (
    <motion.span
      className={cn("inline-block bg-gradient-to-r bg-clip-text text-transparent", from, via, to, className)}
      style={{
        backgroundSize: animate ? "200% 200%" : "100% 100%",
      }}
      animate={
        animate
          ? {
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }
          : undefined
      }
      transition={
        animate
          ? {
              duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }
          : undefined
      }
    >
      {text}
    </motion.span>
  )
}
