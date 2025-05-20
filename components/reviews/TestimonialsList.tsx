import type { Dictionary } from "@/lib/dictionaries/types"
import Image from "next/image"

interface TestimonialsListProps {
  testimonials: Dictionary["testimonials"]
  title: Dictionary["reviewsPage"]["testimonials"]
}

export default function TestimonialsList({ testimonials, title }: TestimonialsListProps) {
  return (<section className="w-full bg-gray-900 py-24 text-white">
    <div>
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-2">{title.title}</h2>
        <p className="text-gray-600 dark:text-gray-400">{title.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.items.map((testimonial, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
             
              </div>
              <div>
                <h3 className="font-semibold">{testimonial.author}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.quote}"</p>
          </div>
        ))}
      </div>
    </div></section>
  )
}
