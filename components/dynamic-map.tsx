"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { Locale } from "@/lib/i18n-config"

const LocationMapWithNoSSR = dynamic(() => import("./location-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-gold/10 bg-card shadow-lg">
      <div className="text-center">
        <div className="mb-2 h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent"></div>
        <p className="text-muted-foreground">Chargement de la carte...</p>
      </div>
    </div>
  ),
})

interface DynamicMapProps {
  lang: Locale
}

export default function DynamicMap({ lang }: DynamicMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <LocationMapWithNoSSR lang={lang} />
}
