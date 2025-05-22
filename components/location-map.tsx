"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Locale } from "@/lib/i18n-config"
import type { LatLngTuple } from 'leaflet';

// Définir les coordonnées des bureaux
const locations = [
  {
    id: "gafsa",
    name: {
      en: "Gafsa Office",
      fr: "Bureau de Gafsa",
      ar: "مكتب قفصة",
    },
    address: {
      en: "Rawashed Medical Center, Sidi Ahmed Zarrouk, Gafsa 2112",
      fr: "Centre Médical Rawashed, Sidi Ahmed Zarrouk, Gafsa 2112",
      ar: "مركز رواشد الطبي، سيدي أحمد زروق، قفصة 2112",
    },
       position: [34.43367035026561, 8.750944307185934] as LatLngTuple,
 // Coordonnées approximatives pour Gafsa
  },
  {
    id: "sousse",
    name: {
      en: "Sousse Office",
      fr: "Bureau de Sousse",
      ar: "مكتب سوسة",
    },
    address: {
      en: "Kantaoui Medical Center, 14 January Street, Tourist Road, Sousse, Office B53",
      fr: "Centre Médical Kantaoui, Rue 14 Janvier, Route Touristique, Sousse, Bureau B53",
      ar: "المركز الطبي القنطاوي، شارع 14 جانفي، الطريق السياحية، سوسة، مكتب B53",
    },
    position: [35.862587770916264, 10.609686309696079]as LatLngTuple, // Coordonnées approximatives pour Sousse
  },
]

interface LocationMapProps {
  lang: Locale
}

export default function LocationMap({ lang }: LocationMapProps) {
  const [mounted, setMounted] = useState(false)

  // Créer une icône personnalisée pour les marqueurs
  const customIcon = new L.Icon({
    iconUrl: "/map.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-xl border border-gold/10 shadow-lg">
      <MapContainer
        center={[35.0, 9.5]} // Centre approximatif de la Tunisie
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <Marker key={location.id} position={location.position} icon={customIcon}>
            <Popup className="leaflet-popup">
              <div className="p-1">
                <h3 className="mb-1 text-base font-bold">{location.name[lang]}</h3>
                <p className="text-sm">{location.address[lang]}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

