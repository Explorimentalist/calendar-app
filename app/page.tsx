"use client"

import { NdoweyeCalendar } from "./components/ndoweye-calendar"
import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Delay between each child animation
      delayChildren: 0.2,   // Initial delay before starting animations
    }
  }
}

const itemVariants = {
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

export default function Page() {
  return (
    <div className="relative min-h-screen">
      {/* Background gradient container */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,1)_0%,rgba(255,255,255,0.9)_25%,rgba(255,255,255,0.8)_50%)]" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 animate-slow-spin">
            <div className="absolute inset-[-100%] blur-[100px] opacity-50"
              style={{
                background: `
                  linear-gradient(
                    45deg,
                    rgba(97, 183, 237, 0.5) -10%,
                    rgba(155, 89, 182, 0.3) 20%,
                    rgba(231, 76, 60, 0.3) 40%,
                    rgba(241, 196, 15, 0.3) 60%,
                    rgba(46, 204, 113, 0.3) 80%,
                    rgba(52, 152, 219, 0.5) 110%
                  )
                `
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 custom:px-[5%] flex flex-col min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex-grow flex items-center justify-center w-full"
          variants={itemVariants}
        >
          <NdoweyeCalendar />
        </motion.div>
        <motion.footer 
          className="text-center py-4 text-sm text-gray-600"
          variants={itemVariants}
        >
          Elanjiminyya © 2024. Designed by the Explorimentalist.
        </motion.footer>
      </motion.div>
    </div>
  )
}