"use client"

import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { Mail, Phone, Clock, ChevronDown, ChevronUp, Facebook, Instagram, Linkedin } from "lucide-react"
import { useState, useEffect } from "react"

export default function InfoBar({ dictionary }: { dictionary: any }) {
  const [isOpen, setIsOpen] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [currentInfoIndex, setCurrentInfoIndex] = useState(0)
  const controls = useAnimation()
  const isRTL = dictionary?.dir === 'rtl'

  const infoItems = [
    {
      icon: <Mail className="me-2 h-3 w-3 text-[#FFC000]" />, // Changé mr-2 → me-2
      text: "merle.assistance@gmail.com",
    },
    {
      icon: <Phone className="me-2 h-3 w-3 text-[#FFC000]" />,
      text: (
      <span style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
        +216 76 210 618
      </span>
    ),
    },
    {
      icon: <Clock className="me-2 h-3 w-3 text-[#FFC000]" />,
      text: "Lun-Ven: 8h-18h, Sam: 9h-13h",
    },
  ]

  const socialIconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2, y: -2 },
  }

  const carouselVariants = (isRTL: boolean) => ({
    enter: { x: isRTL ? -300 : 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: isRTL ? 300 : -300, opacity: 0 },
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInfoIndex((prevIndex) => (prevIndex + 1) % infoItems.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <AnimatePresence>
       
          <motion.div
            dir={dictionary?.dir} // Ajout de la direction
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-50 bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden border-b border-[#FFC000]/20"
          >
            <div className="container mx-auto px-4 py-2 sm:py-3 flex flex-col sm:flex-row justify-between items-center">
              {/* Carrousel mobile/desktop */}
              <div className="w-full sm:w-auto mb-2 sm:mb-0">
                <div className="relative h-6 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentInfoIndex}
                      variants={carouselVariants(isRTL)}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className={`flex items-center text-xs sm:text-sm text-gray-300 hover:text-[#FFC000] transition-colors w-full ${
                        isRTL ? 'sm:justify-end' : 'sm:justify-start'
                      }`}
                    >
                      {infoItems[currentInfoIndex].icon}
                      <span className="truncate max-w-[200px] xs:max-w-[300px] sm:max-w-none">
                        {infoItems[currentInfoIndex].text}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Icônes sociales responsives */}
              <div className={`flex items-center gap-3 sm:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <motion.a
                  href="#"
                  className="text-xs sm:text-sm text-gray-300 transition-colors hover:text-[#FFC000] flex items-center"
                  variants={socialIconVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <Facebook className="h-3 w-3 sm:h-4 sm:w-4 me-1" /> {/* Changé mr-1 → me-1 */}
                  <span className="hidden xs:inline">Facebook</span>
                </motion.a>
                <motion.a
                  href="#"
                  className="text-xs sm:text-sm text-gray-300 transition-colors hover:text-[#FFC000] flex items-center"
                  variants={socialIconVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <Instagram className="h-3 w-3 sm:h-4 sm:w-4 me-1" />
                  <span className="hidden xs:inline">Instagram</span>
                </motion.a>
                <motion.a
                  href="#"
                  className="text-xs sm:text-sm text-gray-300 transition-colors hover:text-[#FFC000] flex items-center"
                  variants={socialIconVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <Linkedin className="h-3 w-3 sm:h-4 sm:w-4 me-1" />
                  <span className="hidden xs:inline">LinkedIn</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
       
      </AnimatePresence>

      
    </>
  )
}