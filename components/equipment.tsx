"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Tab } from "@headlessui/react"
import type { Locale } from "@/lib/i18n-config"

interface EquipmentProps {
  dictionary: {
    title: string
    subtitle: string
    categories: {
      name: string
      items: {
        name: string
        description: string
        image: string
        features?: string[]
      }[]
    }[]
  }
  lang: Locale
}

export default function Equipment({ dictionary, lang }: EquipmentProps) {
  const isRtl = lang === "ar"
  const [selectedCategory, setSelectedCategory] = useState(0)

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
              {dictionary.title}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
          <p className={`text-lg text-muted-foreground ${isRtl ? "font-arabic" : ""}`}>{dictionary.subtitle}</p>
        </motion.div>

        <div className="mx-auto max-w-6xl">
          <Tab.Group onChange={setSelectedCategory} selectedIndex={selectedCategory}>
            <Tab.List className="mb-12 flex flex-wrap justify-center space-x-2 rounded-xl bg-muted p-1">
              {dictionary.categories.map((category, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    `rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                      selected
                        ? "bg-white text-gold shadow dark:bg-gray-800"
                        : "text-muted-foreground hover:bg-white/[0.12] hover:text-foreground"
                    } ${isRtl ? "font-arabic" : ""}`
                  }
                >
                  {category.name}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              {dictionary.categories.map((category, categoryIndex) => (
                <Tab.Panel key={categoryIndex}>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {category.items.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: itemIndex * 0.1 }}
                        className={`group overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-300 hover:border-gold/30 hover:shadow-lg ${
                          isRtl ? "font-arabic text-right" : ""
                        }`}
                      >
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={item.image || `/placeholder.svg?height=192&width=384&text=${item.name}`}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="mb-2 text-xl font-bold text-foreground">{item.name}</h3>
                          <p className="mb-4 text-muted-foreground">{item.description}</p>
                          {item.features && (
                            <div className="mt-4">
                              <h4 className="mb-2 text-sm font-medium text-foreground">Caractéristiques:</h4>
                              <ul className="space-y-1 text-sm">
                                {item.features.map((feature, featureIndex) => (
                                  <li key={featureIndex} className="flex items-start">
                                    <span className="mr-2 text-gold">•</span>
                                    <span className="text-muted-foreground">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </section>
  )
}
