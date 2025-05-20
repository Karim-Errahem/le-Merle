import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import Hero from "@/components/hero"
import WhyChooseUs from "@/components/why-choose-us"
import Vision from "@/components/vision"
import Services from "@/components/services"
import Contact from "@/components/contact"

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dictionary = await getDictionary(lang)

  return (
    <div className="flex flex-col items-center">
      <Hero dictionary={dictionary.home} lang={lang} />
      <WhyChooseUs dictionary={dictionary.whyChooseUs} lang={lang} />
      <Vision dictionary={dictionary.vision} lang={lang} />
      <Services dictionary={dictionary.services} lang={lang} />
      <Contact dictionary={dictionary.contact} lang={lang} />
    </div>
  )
}
