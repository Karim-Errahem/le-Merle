"use client"

import { motion } from "framer-motion"
import AnimatedCounter from "../ui/animated-counter"
import ScrollReveal from "../ui/scroll-reveal"

interface StatsSectionProps {
  stats: {
    title: string
    items: {
      value: string
      label: string
    }[]
  }
}

export default function StatsSection({ stats }: StatsSectionProps) {
  // Fonction pour extraire la valeur numérique et le suffixe
  const extractNumberAndSuffix = (value: string) => {
    const match = value.match(/^([0-9.]+)(.*)$/)
    if (match) {
      return {
        number: Number.parseFloat(match[1]),
        suffix: match[2],
      }
    }
    return { number: 0, suffix: value }
  }

  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="relative">
              {stats.title}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.items.map((item, index) => {
            const { number, suffix } = extractNumberAndSuffix(item.value)

            return (
              <ScrollReveal key={index} delay={index * 0.1} className="text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 h-full flex flex-col items-center justify-center"
                >
                  <AnimatedCounter
                    to={number}
                    suffix={suffix}
                    className="text-4xl font-bold text-gold mb-2"
                    duration={2}
                  />
                  <div className="text-gray-300">{item.label}</div>
                </motion.div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
