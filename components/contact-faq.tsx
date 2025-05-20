"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"

interface ContactFAQProps {
  dictionary: {
    faqTitle: string
    faqSubtitle: string
    faqs: {
      question: string
      answer: string
    }[]
  }
  lang: Locale
}

export default function ContactFAQ({ dictionary, lang }: ContactFAQProps) {
  const isRtl = lang === "ar"
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="w-full bg-gray-50 py-24 dark:bg-gray-800/50">
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
              {dictionary.faqTitle}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
          <p className={`text-lg text-muted-foreground ${isRtl ? "font-arabic" : ""}`}>{dictionary.faqSubtitle}</p>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          {dictionary.faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`mb-4 overflow-hidden rounded-xl border border-border bg-card transition-all ${
                isRtl ? "font-arabic text-right" : ""
              }`}
            >
              <button
                className="flex w-full items-center justify-between p-6 text-left"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <h3 className="text-lg font-medium text-foreground">{faq.question}</h3>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 pb-6 pt-0" : "max-h-0"
                }`}
              >
                <div className="px-6">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
