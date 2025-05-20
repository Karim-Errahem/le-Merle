import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"

interface FooterProps {
  lang: Locale
  dictionary: {
    links: {
      title: string
      items: {
        name: string
        href: string
      }[]
    }[]
    contact: {
      title: string
      email: string
      phone: string
      address: string
    }
    copyright: string
  }
}

export default function Footer({ lang, dictionary }: FooterProps) {
  const isRtl = lang === "ar"

  return (
    <footer className="w-full bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className={isRtl ? "font-arabic text-right" : ""}>
            <Link href={`/${lang}`} className="mb-6 inline-block">
              <div className="relative h-12 w-48">
                <Image
                  src="/logo.png"
                  alt="Le Merle Logo"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
            </Link>
            <p className="mt-4 text-gray-400">Le Merle Assistance Médicale</p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 text-gray-400 transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 text-gray-400 transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 text-gray-400 transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 text-gray-400 transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {dictionary.links.map((group, groupIndex) => (
            <div key={groupIndex} className={isRtl ? "font-arabic text-right" : ""}>
              <h3 className="mb-6 text-lg font-bold text-gold">{group.title}</h3>
              <ul className="space-y-3">
                {group.items.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={`/${lang}${link.href}`}
                      className="group text-gray-400 transition-colors hover:text-gold"
                    >
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                        {isRtl ? "←" : "→"}
                      </span>{" "}
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={isRtl ? "font-arabic text-right" : ""}>
            <h3 className="mb-6 text-lg font-bold text-gold">{dictionary.contact.title}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <MapPin className="h-4 w-4 text-gold" />
                </div>
                <span className="text-gray-400">{dictionary.contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <Phone className="h-4 w-4 text-gold" />
                </div>
                <span className="text-gray-400">{dictionary.contact.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <Mail className="h-4 w-4 text-gold" />
                </div>
                <a
                  href={`mailto:${dictionary.contact.email}`}
                  className="text-gray-400 transition-colors hover:text-gold"
                >
                  {dictionary.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className={`text-sm text-gray-500 ${isRtl ? "font-arabic" : ""}`}>{dictionary.copyright}</p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gold">
                Politique de confidentialité
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gold">
                Conditions d'utilisation
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
