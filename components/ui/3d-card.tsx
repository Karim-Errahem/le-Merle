"use client"

import type React from "react"

import { useState, useRef, type ReactNode } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

interface Card3DProps {
  children: ReactNode
  className?: string
  intensity?: number
  border?: boolean
  shadow?: boolean
  disabled?: boolean
}

export default function Card3D({
  children,
  className = "",
  intensity = 10,
  border = true,
  shadow = true,
  disabled = false,
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState(false)

  // Motion values for tracking mouse position
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth springs for more natural movement
  const springConfig = { damping: 20, stiffness: 300 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  // Transform mouse position to rotation values
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-intensity, intensity])

  // Handle mouse move on card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || disabled) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate normalized mouse position
    const normalizedX = mouseX / width - 0.5
    const normalizedY = mouseY / height - 0.5

    x.set(normalizedX)
    y.set(normalizedY)
  }

  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setHover(false)
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className} ${disabled ? "" : "interactive"}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{
          rotateX: disabled ? 0 : rotateX,
          rotateY: disabled ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`h-full w-full rounded-xl ${border ? "border border-white/20 dark:border-white/10" : ""} ${
          shadow ? "shadow-xl" : ""
        } transition-shadow duration-300 ${hover && shadow ? "shadow-2xl" : ""}`}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
