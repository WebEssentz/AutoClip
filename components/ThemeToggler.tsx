// components/ThemeToggler.tsx
'use client'

import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

// components/ThemeToggler.tsx
export default function ThemeToggler() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center justify-center w-12 h-12 rounded-full 
                 bg-zinc-100 dark:bg-zinc-800 
                 hover:bg-zinc-200 dark:hover:bg-zinc-700 
                 text-zinc-900 dark:text-zinc-100
                 transition-all shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={isDark ? 'dark' : 'light'}
      transition={{ 
        duration: 0.2,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </motion.button>
  )
}