"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"
import ScrollReveal from "./ui/scroll-reveal"

interface PromoVideoProps {
  dictionary: {
    title: string
    subtitle: string
    videoUrl: string
    posterUrl: string
  }
  lang: Locale
}

export default function PromoVideo({ dictionary, lang }: PromoVideoProps) {
  const isRtl = lang === "ar"
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <section className="w-full bg-gray-900 py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className={`mb-4 text-3xl font-bold text-white md:text-4xl ${isRtl ? "font-arabic" : ""}`}>
            <span className="relative">
              {dictionary.title}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
          <p className={`text-lg text-gray-300 ${isRtl ? "font-arabic" : ""}`}>{dictionary.subtitle}</p>
        </ScrollReveal>

        <ScrollReveal className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            {/* Overlay de gradient */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>

            {/* Vidéo */}
            <video
              ref={videoRef}
              className="w-full aspect-video object-cover"
              poster={dictionary.posterUrl}
              muted
              playsInline
              loop
            >
              <source src={dictionary.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Contrôles personnalisés */}
            <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between p-6">
              <motion.button
                onClick={togglePlay}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-gold"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
              </motion.button>

              <motion.button
                onClick={toggleMute}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-gold"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </motion.button>
            </div>

            {/* Bouton de lecture central */}
            {!isPlaying && (
              <motion.button
                onClick={togglePlay}
                className="absolute left-1/2 top-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-gold"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="h-10 w-10 ml-2" />
              </motion.button>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
