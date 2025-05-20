import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combine plusieurs classes CSS conditionnellement et les fusionne avec tailwind-merge
 * pour éviter les conflits de classes Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate un prix avec le symbole de devise et le séparateur de milliers
 */
export function formatPrice(
  price: number,
  options: {
    currency?: "EUR" | "USD" | "TND"
    notation?: Intl.NumberFormatOptions["notation"]
  } = {},
) {
  const { currency = "TND", notation = "standard" } = options

  const currencySymbols: Record<string, string> = {
    EUR: "€",
    USD: "$",
    TND: "د.ت",
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    notation,
    currencyDisplay: "symbol",
  }).format(price)
}

/**
 * Tronque un texte à une longueur maximale et ajoute des points de suspension
 */
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

/**
 * Génère un slug à partir d'une chaîne de caractères
 */
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Remplace les espaces par des tirets
    .replace(/[^\w-]+/g, "") // Supprime tous les caractères non-word
    .replace(/--+/g, "-") // Remplace les tirets multiples par un seul tiret
    .replace(/^-+/, "") // Supprime les tirets au début
    .replace(/-+$/, "") // Supprime les tirets à la fin
}

/**
 * Retourne la date formatée selon la locale
 */
export function formatDate(date: Date | string, locale = "fr-FR") {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dateObj)
}
