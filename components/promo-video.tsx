"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import type { Locale } from "@/lib/i18n-config"

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
  const [isMuted, setIsMuted] = useState(false)
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className={`mb-4 text-3xl font-bold text-white md:text-4xl ${isRtl ? "font-arabic" : ""}`}>
            <span className="relative">
              {dictionary.title}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
          <p className={`text-lg text-gray-300 ${isRtl ? "font-arabic" : ""}`}>{dictionary.subtitle}</p>
        </motion.div>

        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl shadow-2xl"
          >
            <div className="aspect-w-16 aspect-h-9 relative">
              <video
                ref={videoRef}
                poster={dictionary.posterUrl || "/placeholder.svg?height=720&width=1280&text=Vidéo+Promotionnelle"}
                className="h-full w-full object-cover"
                onEnded={() => setIsPlaying(false)}
                playsInline
              >
                <source src={dictionary.videoUrl} type="video/mp4" />
                Votre navigateur ne prend pas en charge la lecture de vidéos.
              </video>

              {/* Overlay de contrôle */}
              <div
                className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity ${
                  isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
                }`}
              >
                <button
                  onClick={togglePlay}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/90 text-white transition-transform hover:scale-110"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 translate-x-0.5" />}
                </button>
              </div>

              {/* Contrôles en bas */}
              <div
                className={`absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity ${
                  isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
                }`}
              >
                <div>
                  <button
                    onClick={togglePlay}
                    className="mr-4 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5" />}
                  </button>
                </div>
                <div>
                  <button
                    onClick={toggleMute}
                    className="rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
