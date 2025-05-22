import type { Locale } from "@/lib/i18n-config";
import { getDictionary } from "@/lib/dictionaries";
import ContactHero from "@/components/contact-hero";
import ContactForm from "@/components/contact-form";
import ContactInfo from "@/components/contact-info";
import AppointmentForm from "@/components/appointment-form";
import ContactFAQ from "@/components/contact-faq";

export default async function ContactPage(props: { params: { lang: Locale } }) {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="flex flex-col">
      <ContactHero dictionary={dictionary.contactPage} lang={lang} />
      <div className="container mx-auto grid gap-12 px-4 py-16 md:grid-cols-2 lg:py-24">
       <section id="contact-info"><ContactInfo dictionary={dictionary.contact} lang={lang} /></section> 
        <section id="contact-form"><ContactForm dictionary={dictionary.contact} lang={lang} /></section> 
      </div>
      <section id="appointment-form"><AppointmentForm dictionary={dictionary.appointment} lang={lang} /></section> 
      <section id="contact-faq"><ContactFAQ dictionary={dictionary.contactPage} lang={lang} /></section>
    </div>
  );
}
