"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxSectionProps {
  children: React.ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right"
  speed?: number
  offset?: number
}

export default function ParallaxSection({
  children,
  className = "",
  direction = "up",
  speed = 0.5,
  offset = 300,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const transformUp = useTransform(scrollYProgress, [0, 1], [offset, -offset * speed])
  const transformDown = useTransform(scrollYProgress, [0, 1], [-offset, offset * speed])
  const transformLeft = useTransform(scrollYProgress, [0, 1], [offset, -offset * speed])
  const transformRight = useTransform(scrollYProgress, [0, 1], [-offset, offset * speed])

  const isHorizontal = direction === "left" || direction === "right"

  let transform
  switch (direction) {
    case "up":
      transform = transformUp
      break
    case "down":
      transform = transformDown
      break
    case "left":
      transform = transformLeft
      break
    case "right":
      transform = transformRight
      break
    default:
      transform = transformUp
  }

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{
          [isHorizontal ? "x" : "y"]: transform,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
