import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n-config"
import Testimonials from "@/components/testimonials"
import TestimonialsList from "@/components/reviews/TestimonialsList"
import ReviewForm from "@/components/reviews/ReviewForm"
import StatsSection from "@/components/reviews/StatsSection"
import ContactHero from "@/components/reviews-hero";
export default async function ReviewsPage({
  params,
}: {
  params: { lang: Locale }
}) {
  const lang = params.lang
  const dictionary = await getDictionary(lang)

  return (
   <div className="flex flex-col space-y-0">
  <ContactHero dictionary={dictionary.reviewsPage} lang={lang} />

  <div className="w-full mx-auto px-4 -mt-4">
    <div className="mx-auto grid max-w-18xl gap-0 lg:grid-cols-2">
      <ReviewForm dictionary={dictionary.reviewsPage.form} />
      <Testimonials dictionary={dictionary.testimonials} lang={lang} />
    </div>
  </div>

  <StatsSection stats={dictionary.reviewsPage.stats} />
</div>


  )
}
