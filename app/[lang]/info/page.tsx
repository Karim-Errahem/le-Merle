import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n-config"

import InfoSection from "@/components/info/InfoSection"
import ResourcesList from "@/components/info/ResourcesList"
import ContactHero from "@/components/info-hero";
export default async function InfoPage({
  params,
}: {
  params: { lang: Locale }
}) {
  const lang = params.lang
  const dictionary = await getDictionary(lang)

  return (
       <div className="flex flex-col space-y-0">
    <ContactHero dictionary={dictionary.infoPage} lang={lang} />
    <div className="container mx-auto px-4 py-8">
    

      <div className="space-y-12 my-12">
        {dictionary.infoPage.sections.map((section, index) => (
          <InfoSection key={index} section={section} lang={lang} />
        ))}
      </div>

      <ResourcesList resources={dictionary.infoPage.resources} />
    </div></div>
  )
}
