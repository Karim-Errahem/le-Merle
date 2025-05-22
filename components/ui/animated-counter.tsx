"use client"

import { useEffect, useRef } from "react"
import { useInView, useMotionValue, useSpring } from "framer-motion"
import { motion } from "framer-motion"

interface AnimatedCounterProps {
  from?: number
  to: number
  duration?: number
  delay?: number
  formatter?: (value: number) => string
  className?: string
  prefix?: string
  suffix?: string
}

export default function AnimatedCounter({
  from = 0,
  to,
  duration = 1.5,
  delay = 0,
  formatter = (value) => Math.round(value).toString(),
  className = "",
  prefix = "",
  suffix = "",
}: AnimatedCounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(nodeRef, { once: true, amount: 0.5 })

  const count = useMotionValue(from)
  const springCount = useSpring(count, { duration: duration * 1000, bounce: 0 })

  useEffect(() => {
    if (isInView) {
      count.set(to)
    }
  }, [count, isInView, to])

  useEffect(() => {
    if (!nodeRef.current) return

    const unsubscribe = springCount.on("change", (latest) => {
      if (nodeRef.current) {
        nodeRef.current.textContent = prefix + formatter(latest) + suffix
      }
    })

    return unsubscribe
  }, [formatter, prefix, springCount, suffix])

  return (
    <motion.span
      ref={nodeRef}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      {prefix + formatter(from) + suffix}
    </motion.span>
  )
}
