
import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import AboutHero from "@/components/about-hero"
import AboutMission from "@/components/about-mission"
import AboutTeam from "@/components/about-team"
import PromoVideo from "@/components/promo-video"
import AboutHistory from "@/components/about-history"
import AboutPartners from "@/components/about-partners"

export default async function AboutPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dictionary = await getDictionary(lang)

  return (
    <div className="flex flex-col">
      <AboutHero dictionary={dictionary.aboutPage} lang={lang} />
      <AboutMission dictionary={dictionary.aboutPage} lang={lang} />
      <PromoVideo dictionary={dictionary.promoVideo} lang={lang} />
      <AboutHistory dictionary={dictionary.aboutPage} lang={lang} />
      <AboutTeam dictionary={dictionary.aboutPage} lang={lang} />
      <AboutPartners dictionary={dictionary.aboutPage} lang={lang} />
    </div>
  )
}
