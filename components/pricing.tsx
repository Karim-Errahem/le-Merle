"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, HelpCircle } from 'lucide-react'
import type { Locale } from "@/lib/i18n-config"

interface PricingProps {
  dictionary: {
    title: string
    subtitle: string
    pricingToggle: {
      monthly: string
      yearly: string
    }
    plans: {
      name: string
      description: string
      price: {
        monthly: string
        yearly: string
      }
      features: string[]
      popular?: boolean
      cta: string
    }[]
    disclaimer: string
  }
  lang: Locale
}

export default function Pricing({ dictionary, lang }: PricingProps) {
  const isRtl = lang === "ar"
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="w-full bg-background py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className={`mb-4 text-3xl font-bold text-foreground md:text-4xl ${isRtl ? "font-arabic" : ""}`}>
            <span className="relative">
              {dictionary.title}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
          <p className={`text-lg text-muted-foreground ${isRtl ? "font-arabic" : ""}`}>{dictionary.subtitle}</p>

          {/* Toggle de période de facturation */}
          <div className="mt-8 flex items-center justify-center">
            <div className="relative flex rounded-full bg-muted p-1">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  billingPeriod === "monthly"
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {dictionary.pricingToggle.monthly}
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  billingPeriod === "yearly"
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {dictionary.pricingToggle.yearly}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {dictionary.plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={item}
              className={`relative overflow-hidden rounded-2xl border ${
                plan.popular
                  ? "border-gold bg-gold/5 shadow-lg shadow-gold/10"
                  : "border-border bg-card shadow-md"
              } ${isRtl ? "font-arabic text-right" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -right-12 top-6 z-10 w-40 rotate-45 bg-gold py-1 text-center text-xs font-semibold text-white">
                  Populaire
                </div>
              )}
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="mb-6 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">
                    {billingPeriod === "monthly" ? plan.price.monthly : plan.price.yearly}
                  </span>
                  <span className="text-muted-foreground">
                    {billingPeriod === "monthly" ? "/mois" : "/an"}
                  </span>
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="mr-2 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full rounded-lg py-3 text-center font-medium transition-colors ${
                    plan.popular
                      ? "bg-gold text-white hover:bg-amber-500"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            <HelpCircle className="mr-1 inline-block h-4 w-4" />
            {dictionary.disclaimer}
          </p>
        </div>
      </div>
    </section>
  )
}
