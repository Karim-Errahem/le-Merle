export interface Dictionary {
  navigation: {
    home: string
    services: string
    about: string
    contact: string
    info: string
    blog: string
    reviews: string
    searchPlaceholder: string
    lightMode: string
    darkMode: string
  }
  home: {
    title: string
    subtitle: string
    cta: string
  }
  whyChooseUs: {
    title: string
    description: string
    benefits: string[]
    conclusion: string
  }
  vision: {
    visionTitle: string
    visionText: string
    missionTitle: string
    missionText: string
    valuesTitle: string
    values: {
      title: string
      description: string
    }[]
  }
  services: {
    title: string
    services: {
      title: string
      description: string
      image: string
      features: string[]
    }[]
  }
  pricing: {
    title: string
    subtitle: string
    pricingToggle: {
      monthly: string
      yearly: string
    }
    plans: {
      name: string
      description: string
      price: {
        monthly: string
        yearly: string
      }
      features: string[]
      popular?: boolean
      cta: string
    }[]
    disclaimer: string
  }
  equipment: {
    title: string
    subtitle: string
    categories: {
      name: string
      items: {
        name: string
        description: string
        image: string
        features: string[]
      }[]
    }[]
  }
  promoVideo: {
    title: string
    subtitle: string
    videoUrl: string
    posterUrl: string
  }
  appointment: {
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
  testimonials: {
    title: string
    subtitle: string
    items: {
      quote: string
      author: string
      role: string
      image: string
    }[]
  }
  contact: {
    title: string
    subtitle: string
    mapTitle: string
    locations: {
      name: string
      address: string
      phone: string
      mobile?: string
      email: string
      hours: string
    }[]
    formTitle: string
    nameLabel: string
    emailLabel: string
    messageLabel: string
    submitButton: string
    successMessage: string
  }
  servicesPage: {
    title: string
    subtitle: string
    ctaTitle: string
    ctaText: string
    ctaButton: string
  }
  aboutPage: {
    title: string
    subtitle: string
    missionTitle: string
    missionText: string
    visionTitle: string
    visionText: string
    valuesTitle: string
    values: {
      title: string
      description: string
      icon: string
    }[]
    historyTitle: string
    historyText: string
    milestones: {
      year: string
      title: string
      description: string
    }[]
    teamTitle: string
    teamSubtitle: string
    members: {
      name: string
      role: string
      bio: string
      image: string
      social: {
        linkedin: string
      }
    }[]
    partnersTitle: string
    partnersSubtitle: string
    partners: {
      name: string
      logo: string
    }[]
  }
  contactPage: {
    title: string
    subtitle: string
    image: string
    faqTitle: string
    faqSubtitle: string
    faqs: {
      question: string
      answer: string
    }[]
  }
  infoPage: {
    title: string
    subtitle: string
    sections: {
      title: string
      content: string[]
      image?: string
    }[]
    resources: {
      title: string
      subtitle: string
      items: {
        title: string
        description: string
        link: string
        icon: string
      }[]
    }
  }
  blogPage: {
    title: string
    subtitle: string
    categories: {
      all: string
      health: string
      tips: string
      news: string
      stories: string
    }
    readMore: string
    posts: {
      title: string
      excerpt: string
      date: string
      author: string
      category: string
      image: string
      slug: string
    }[]
  }
  reviewsPage: {
    title: string
    subtitle: string
    testimonials: {
      title: string
      subtitle: string
    }
    form: {
      title: string
      subtitle: string
      nameLabel: string
      emailLabel: string
      ratingLabel: string
      messageLabel: string
      submitButton: string
      successMessage: string
    }
    stats: {
      title: string
      items: {
        value: string
        label: string
      }[]
    }
  }
  footer: {
    links: {
      title: string
      items: {
        name: string
        href: string
      }[]
    }[]
    contact: {
      title: string
      email: string
      phone: string
      address: string
    }
    copyright: string
  }
  
  
}
