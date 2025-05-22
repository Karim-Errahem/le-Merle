import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import ServiceHero from "@/components/service-hero"
import ServicesList from "@/components/services-list"
import Pricing from "@/components/pricing"
import Equipment from "@/components/equipment"
import Testimonials from "@/components/testimonials"
import ServiceCTA from "@/components/service-cta"

export default async function ServicesPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dictionary = await getDictionary(lang)

  return (
    <div className="flex flex-col">
      <ServiceHero dictionary={dictionary.servicesPage} lang={lang} />
      <section id="services-list"><ServicesList dictionary={dictionary.services} lang={lang} /></section>
      <section id="pricing"><Pricing dictionary={dictionary.pricing} lang={lang} /></section>
      <section id="equipment"><Equipment dictionary={dictionary.equipment} lang={lang} /></section>
      <Testimonials dictionary={dictionary.testimonials} lang={lang} />
      <ServiceCTA dictionary={dictionary.servicesPage} lang={lang} />
    </div>
  )
}
