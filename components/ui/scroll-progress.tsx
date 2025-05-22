"use client"

import { motion, useScroll, useSpring } from "framer-motion"

interface ScrollProgressProps {
  color?: string
  height?: number
  zIndex?: number
}

export default function ScrollProgress({ color = "bg-gold", height = 4, zIndex = 50 }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className={`fixed left-0 right-0 top-0 origin-left ${color}`}
      style={{
        scaleX,
        height,
        zIndex,
      }}
    />
  )
}
