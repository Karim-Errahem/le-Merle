import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Le Merle Assistance Médicale",
  description: "Services médicaux et assistance à domicile",
  icons: {
    icon: "/logo.png", // ⚠️ Point critique
  },
    generator: 'v0.dev'
};
export default function RootLayout({
  
  children,
}: {
  children: React.ReactNode
}) {
  return (children)
}
