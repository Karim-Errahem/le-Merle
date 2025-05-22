"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  once?: boolean
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number
  threshold?: number
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  once = true,
  direction = "up",
  distance = 50,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })

  // Define initial with proper type to include x and y
  let initial: { opacity: number; x?: number; y?: number } = { opacity: 0 }

  if (direction === "up") {
    initial = { ...initial, y: distance }
  } else if (direction === "down") {
    initial = { ...initial, y: -distance }
  } else if (direction === "left") {
    initial = { ...initial, x: distance }
  } else if (direction === "right") {
    initial = { ...initial, x: -distance }
  }

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : initial}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}