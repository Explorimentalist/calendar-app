"use client"

import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "../components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const months = [
  "Mayalé", "Magaya", "Maliya", "Manóyó", "Malóngó", "Masara",
  "Maloka", "Mateya", "Malimba", "Mavuré", "Masingo", "Matomba"
]

const weekdays = [
  "Bongôndé", "Botyêyi", "Bovènga", "Bongàmbi", "Bolômbé", "Boràmbbé", "Bopànya"
]

// Add animation variants
const buttonVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100
    }
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    }
  }
}

export function NdoweyeCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [displayDate, setDisplayDate] = useState(new Date())
  const [isNarrowScreen, setIsNarrowScreen] = useState(false)
  const scrollViewRef = useRef<HTMLDivElement>(null)
  const [goingForward, setGoingForward] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000 * 60) // Update every minute
    
    const handleResize = () => {
      setIsNarrowScreen(window.innerWidth <= 680)
    }
    
    window.addEventListener('resize', handleResize)
    handleResize() // Initial check
    
    return () => {
      clearInterval(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (isNarrowScreen && scrollViewRef.current) {
      const today = new Date()
      const currentMonthElement = scrollViewRef.current.querySelector(`[data-date="${today.getDate()}-${today.getMonth()}-${today.getFullYear()}"]`)
      if (currentMonthElement) {
        currentMonthElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [isNarrowScreen, displayDate])

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1 // Ajusta para que el domingo sea el último día de la semana
  }

  const goToPreviousMonth = () => {
    setGoingForward(false);
    setDisplayDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  }

  const goToNextMonth = () => {
    setGoingForward(true);
    setDisplayDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  }

  const renderCalendar = () => {
    const year = displayDate.getFullYear()
    const month = displayDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    if (isNarrowScreen) {
      return (
        <div className="space-y-2">
          {days.map((day, index) => {
            const date = new Date(year, month, day)
            const dayName = weekdays[date.getDay()]
            const isCurrentDay = day === currentDate.getDate() &&
                                 month === currentDate.getMonth() &&
                                 year === currentDate.getFullYear()
            const isYesterday = day === currentDate.getDate() - 1 &&
                                 month === currentDate.getMonth() &&
                                 year === currentDate.getFullYear()
            
            return (
              <div key={day}>
                <div
                  data-date={`${day}-${month}-${year}`}
                  className={`flex items-center p-4 ${
                    isCurrentDay ? 'bg-orange-500 text-white pt-6' : 'bg-white'
                  }`}
                >
                  <div className="flex flex-col items-start pl-4">
                    <div className={`text-sm ${isCurrentDay ? 'text-white' : 'text-gray-500'}`}>{dayName}</div>
                    <div className={`text-2xl font-bold ${isCurrentDay ? 'text-white' : 'text-gray-900'}`}>
                      {day}
                    </div>
                  </div>
                </div>
                {index < days.length - 1 && !isCurrentDay && !isYesterday && (<div className="h-px bg-gray-200 mx-4" />)}
              </div>
            )
          })}
        </div>
      )
    }

    const calendarRows = []
    let cells: any[] = [] // Especificar el tipo de 'cells'

    weekdays.forEach((day, index) => {
      cells.push(
        <div key={`header-${index}`} className="text-sm font-medium text-gray-500 mb-4 text-center font-lexend-deca">
          {day}
        </div>
      )
    })
    calendarRows.push(<div key="header" className="grid grid-cols-7 gap-4 mb-4">{cells}</div>)

    cells = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} className="h-12"></div>)
    }

    days.forEach((day, index) => {
      const date = new Date(year, month, day)
      const isWeekend = date.getDay() === 6 || date.getDay() === 0 // 6 is Saturday, 0 is Sunday
      const isCurrentDay = day === currentDate.getDate() &&
                           month === currentDate.getMonth() &&
                           year === currentDate.getFullYear()
      cells.push(
        <div
          key={day}
          className={`flex items-center justify-center h-12 text-lg font-medium font-lexend-deca ${
            isCurrentDay
              ? 'bg-orange-500 text-white rounded-full'
              : 'text-gray-900 hover:bg-gray-100 rounded-full transition-colors'
          } ${isWeekend ? 'text-gray-400' : ''}`}
        >
          {day}
        </div>
      )

      if ((index + firstDayOfMonth) % 7 === 6 || day === daysInMonth) {
        calendarRows.push(
          <div key={`row-${calendarRows.length}`} className="grid grid-cols-7 gap-4">
            {cells}
          </div>
        )
        cells = []
      }
    })

    return calendarRows
  }

  return (
    <div className="flex flex-col items-center w-full">
      <motion.div 
        layout
        transition={{ duration: 0.15, layout: { duration: 0.15 } }}
        className={`w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${
          isNarrowScreen ? 'flex flex-col h-[80vh]' : 'px-20 py-14'
        }`}
      >
        <div className={`flex items-end justify-between mb-8 ${
          isNarrowScreen ? 'p-4 bg-white sticky top-0 z-10' : ''
        }`}>
          <Button variant="ghost" size="icon" className="text-gray-600" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <AnimatePresence mode="wait">
            <motion.div
              key={displayDate.getMonth()}
              initial={{ opacity: 0, x: goingForward ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: goingForward ? -10 : 10 }}
              transition={{ duration: 0.2 }}
              className="text-center font-lexend-deca"
            >
              <h3 className="text-xl font-semibold text-gray-600 mb-1">
                {displayDate.getFullYear()}
              </h3>
              <h2 className="text-4xl font-bold text-gray-900">
                {months[displayDate.getMonth()]}
              </h2>
            </motion.div>
          </AnimatePresence>
          <Button variant="ghost" size="icon" className="text-gray-600" onClick={goToNextMonth}>
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
        <motion.div
          ref={scrollViewRef}
          key={displayDate.getMonth()}
          initial={{ opacity: 0, x: goingForward ? 10 : -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: goingForward ? -10 : 10 }}
          transition={{ 
            duration: 0.3,
            ease: "easeInOut",
            layout: { duration: 0.3 }
          }}
          layout="position"
          className="space-y-4"
        >
          {renderCalendar()}
        </motion.div>
      </motion.div>
      
      {/* Buttons below calendar */}
      <motion.div 
        className={`mt-8 space-y-6 w-full max-w-[680px] ${isNarrowScreen ? 'px-4' : ''}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={buttonVariants}>
          <a 
            href="https://explorimentalist.gumroad.com/l/mwvsp?_gl=1*xchebq*_ga*MTgwNzkxNzMwNy4xNjk2ODY0OTM5*_ga_6LJN6D94N6*MTcyNjI1NDI0My4yMC4xLjE3MjYyNTQ2MzguMC4wLjA."
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full border-2 border-gray-600 text-gray-600 px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300 ease-in-out hover:border-black hover:text-black hover:shadow-lg font-lexend-deca"
          >
            Comprar versión para imprimir 2024
          </a>
        </motion.div>
        <motion.div variants={buttonVariants}>
          <Link 
            href="/formulario-impreso" 
            className="block w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300 ease-in-out hover:bg-black hover:shadow-lg font-lexend-deca"
          >
            Solicitar versión impresa 2025
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}