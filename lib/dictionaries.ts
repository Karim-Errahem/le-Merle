import type { Locale } from "./i18n-config"

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
  ar: () => import("./dictionaries/ar.json").then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
  const loader = dictionaries[locale as keyof typeof dictionaries]
  if (!loader) {
    throw new Error(`Dictionary loader not found for locale: ${locale}`)
  }
  return loader()
}
