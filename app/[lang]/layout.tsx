import type React from "react"
import { Inter, Amiri } from "next/font/google"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { type Locale, i18n } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import Header from "@/components/header"
import Footer from "@/components/footer"
import InfoBar from "@/components/InfoBar"
import PageTransition from "@/components/ui/page-transition"
import ScrollProgress from "@/components/ui/scroll-progress"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-arabic" })

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  const lang = params.lang || i18n.defaultLocale
  const dir = lang === "ar" ? "rtl" : "ltr"
  const dictionary = await getDictionary(lang)

  // Ajout des propriétés manquantes pour le thème
  const navigationWithTheme = {
    ...dictionary.navigation,
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
  }

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <body className={`${inter.variable} ${amiri.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ScrollProgress />
          <div className="flex min-h-screen flex-col">
            <InfoBar dictionary={dictionary} />
            <Header dictionary={dictionary} lang={lang} />
            <main className="flex-1 pt-[100px]">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer lang={lang} dictionary={dictionary.footer} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
