"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react'
import type { Locale } from "@/lib/i18n-config"

interface AppointmentFormProps {
  dictionary: {
    title: string
    subtitle: string
    form: {
      nameLabel: string
      emailLabel: string
      phoneLabel: string
      dateLabel: string
      timeLabel: string
      serviceLabel: string
      serviceOptions: {
        value: string
        label: string
      }[]
      messageLabel: string
      submitButton: string
      successMessage: string
    }
  }
  lang: Locale
}

export default function AppointmentForm({ dictionary, lang }: AppointmentFormProps) {
  const isRtl = lang === "ar"
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    service: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simuler l'envoi du formulaire
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Réinitialiser le formulaire et afficher le message de succès
    setFormState({
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      service: "",
      message: "",
    })
    setIsSubmitting(false)
    setIsSubmitted(true)

    // Masquer le message de succès après 5 secondes
    setTimeout(() => {
      setIsSubmitted(false)
    }, 5000)
  }

  return (
    <section className="w-full bg-background py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className={`mb-4 text-3xl font-bold text-foreground md:text-4xl ${isRtl ? "font-arabic" : ""}`}>
            <span className="relative">
              {dictionary.title}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
          <p className={`text-lg text-muted-foreground ${isRtl ? "font-arabic" : ""}`}>{dictionary.subtitle}</p>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`overflow-hidden rounded-xl border border-border bg-card p-8 shadow-lg ${
              isRtl ? "font-arabic text-right" : ""
            }`}
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-8 text-center dark:bg-green-900/20"
              >
                <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
                <p className="text-lg font-medium text-green-800 dark:text-green-200">
                  {dictionary.form.successMessage}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-muted-foreground">
                      {dictionary.form.nameLabel}
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        value={formState.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-muted-foreground">
                      {dictionary.form.emailLabel}
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={formState.email}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-muted-foreground">
                    {dictionary.form.phoneLabel}
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="date" className="mb-2 block text-sm font-medium text-muted-foreground">
                      {dictionary.form.dateLabel}
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input
                        type="date"
                        id="date"
                        value={formState.date}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="time" className="mb-2 block text-sm font-medium text-muted-foreground">
                      {dictionary.form.timeLabel}
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input
                        type="time"
                        id="time"
                        value={formState.time}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="mb-2 block text-sm font-medium text-muted-foreground">
                    {dictionary.form.serviceLabel}
                  </label>
                  <select
                    id="service"
                    value={formState.service}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>
                      Sélectionnez un service
                    </option>
                    {dictionary.form.serviceOptions.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-muted-foreground">
                    {dictionary.form.messageLabel}
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-0 top-3 flex items-center pl-3">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <textarea
                      id="message"
                      rows={4}
                      value={formState.message}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                      disabled={isSubmitting}
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-gold to-amber-400 px-6 py-3 text-base font-medium text-gray-900 shadow-lg transition-all duration-300 hover:shadow-gold/20 disabled:opacity-70"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      dictionary.form.submitButton
                    )}
                  </span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
