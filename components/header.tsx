"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import type { Locale } from "@/lib/i18n-config"
import LanguageSwitcher from "./language-switcher"
import ThemeToggle from "@/components/theme-toggle";

interface HeaderProps {
  lang: Locale;
  dictionary: {
    home: string;
    services: string;
    about: string;
    contact: string;
    info: string;
    blog: string;
    reviews: string;
  };
}


export default function Header({ lang, dictionary }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "border-b border-gold/20 bg-background/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
       <Link href={`/${lang}`} className="flex items-center h-full">
  <div className="relative h-full w-[240px] md:w-[200px] sm:w-[160px]">
    <Image
      src="/logo.png"
      alt="Le Merle Logo"
      fill
      className="object-contain"
      priority
    />
  </div>
</Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <ul className="flex space-x-8">
            <li>
              <Link href={`/${lang}`} className="group relative text-sm font-medium text-foreground transition-colors">
                {dictionary.home}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/services`}
                className="group relative text-sm font-medium text-foreground transition-colors"
              >
                {dictionary.services}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/about`}
                className="group relative text-sm font-medium text-foreground transition-colors"
              >
                {dictionary.about}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/contact`}
                className="group relative text-sm font-medium text-foreground transition-colors"
              >
                {dictionary.contact}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <nav className="hidden md:flex">
  <ul className="flex space-x-8">
    {/* Liens existants */}
    <li>
      <Link href={`/${lang}/info`} className="group relative text-sm font-medium text-foreground transition-colors">
        {dictionary.info}
        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:w-full"></span>
      </Link>
    </li>
    <li>
      <Link href={`/${lang}/blog`} className="group relative text-sm font-medium text-foreground transition-colors">
        {dictionary.blog}
        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:w-full"></span>
      </Link>
    </li>
    <li>
      <Link href={`/${lang}/reviews`} className="group relative text-sm font-medium text-foreground transition-colors">
        {dictionary.reviews}
        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:w-full"></span>
      </Link>
    </li>
  </ul>
</nav>

          </ul>
        </nav>

        <div className="flex items-center space-x-4">
       <ThemeToggle lightLabel="Activer le mode clair" darkLabel="Activer le mode sombre" />


          <LanguageSwitcher currentLang={lang} />

          {/* Mobile Menu Button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 text-foreground transition-colors hover:bg-gold/10 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute inset-x-0 top-20 z-50 bg-background/95 py-4 backdrop-blur-md md:hidden">
          <nav className="container mx-auto px-4">
            <ul className="flex flex-col space-y-4">
              <li>
                <Link
                  href={`/${lang}`}
                  className="block text-sm font-medium text-foreground transition-colors hover:text-gold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {dictionary.home}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/services`}
                  className="block text-sm font-medium text-foreground transition-colors hover:text-gold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {dictionary.services}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/about`}
                  className="block text-sm font-medium text-foreground transition-colors hover:text-gold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {dictionary.about}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/contact`}
                  className="block text-sm font-medium text-foreground transition-colors hover:text-gold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {dictionary.contact}
                </Link>
              </li>
            
        {/* Liens existants */}
        <li>
          <Link
            href={`/${lang}/info`}
            className="block text-sm font-medium text-foreground transition-colors hover:text-gold"
            onClick={() => setIsMenuOpen(false)}
          >
            {dictionary.info}
          </Link>
        </li>
        <li>
          <Link
            href={`/${lang}/blog`}
            className="block text-sm font-medium text-foreground transition-colors hover:text-gold"
            onClick={() => setIsMenuOpen(false)}
          >
            {dictionary.blog}
          </Link>
        </li>
        <li>
          <Link
            href={`/${lang}/reviews`}
            className="block text-sm font-medium text-foreground transition-colors hover:text-gold"
            onClick={() => setIsMenuOpen(false)}
          >
            {dictionary.reviews}
          </Link>
        </li>
      
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
