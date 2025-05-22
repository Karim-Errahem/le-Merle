"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Facebook, Twitter, Linkedin } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"
import Card3D from "./ui/3d-card"
import ScrollReveal from "./ui/scroll-reveal"

interface AboutTeamProps {
  dictionary: {
    teamTitle: string
    teamSubtitle: string
    members: {
      name: string
      role: string
      bio: string
      image: string
      social?: {
        facebook?: string
        twitter?: string
        linkedin?: string
      }
    }[]
  }
  lang: Locale
}

export default function AboutTeam({ dictionary, lang }: AboutTeamProps) {
  const isRtl = lang === "ar"

  return (
    <section className="w-full bg-background py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className={`mb-4 text-3xl font-bold text-foreground md:text-4xl ${isRtl ? "font-arabic" : ""}`}>
            <span className="relative">
              {dictionary.teamTitle}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
          <p className={`text-lg text-muted-foreground ${isRtl ? "font-arabic" : ""}`}>{dictionary.teamSubtitle}</p>
        </ScrollReveal>

        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {dictionary.members.map((member, index) => (
            <ScrollReveal key={index} delay={index * 0.1} direction={index % 2 === 0 ? "left" : "right"}>
              <Card3D className="h-full">
                <div className="group overflow-hidden rounded-xl bg-card shadow-lg transition-all duration-300 hover:shadow-xl h-full">
                  <div className="relative h-80 w-full overflow-hidden">
                    <Image
                      src={member.image || `/placeholder.svg?height=320&width=320&text=${member.name}`}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="absolute bottom-0 left-0 flex w-full justify-center space-x-4 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {member.social?.facebook && (
                        <motion.a
                          href={member.social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 transition-transform hover:scale-110"
                          aria-label="Facebook"
                          whileHover={{ y: -5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Facebook className="h-5 w-5" />
                        </motion.a>
                      )}
                      {member.social?.twitter && (
                        <motion.a
                          href={member.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-400 transition-transform hover:scale-110"
                          aria-label="Twitter"
                          whileHover={{ y: -5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Twitter className="h-5 w-5" />
                        </motion.a>
                      )}
                      {member.social?.linkedin && (
                        <motion.a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-700 transition-transform hover:scale-110"
                          aria-label="LinkedIn"
                          whileHover={{ y: -5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Linkedin className="h-5 w-5" />
                        </motion.a>
                      )}
                    </div>
                  </div>
                  <div className={`p-6 ${isRtl ? "font-arabic text-right" : ""}`}>
                    <h3 className="mb-1 text-xl font-bold text-foreground">{member.name}</h3>
                    <p className="mb-4 text-sm font-medium text-gold">{member.role}</p>
                    <p className="text-muted-foreground">{member.bio}</p>
                  </div>
                </div>
              </Card3D>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
