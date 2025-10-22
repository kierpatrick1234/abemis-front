'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ColorScheme = 'default' | 'red' | 'rose' | 'orange' | 'green' | 'blue' | 'yellow' | 'violet'

interface ThemeContextType {
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('default')

  // Load saved color scheme from localStorage on mount
  useEffect(() => {
    const savedScheme = localStorage.getItem('colorScheme') as ColorScheme
    if (savedScheme && ['default', 'red', 'rose', 'orange', 'green', 'blue', 'yellow', 'violet'].includes(savedScheme)) {
      setColorScheme(savedScheme)
    }
  }, [])

  // Apply color scheme to document
  useEffect(() => {
    const applyColorScheme = (scheme: ColorScheme) => {
      const root = document.documentElement
      
      // Remove existing color scheme classes
      root.classList.remove('theme-default', 'theme-red', 'theme-rose', 'theme-orange', 'theme-green', 'theme-blue', 'theme-yellow', 'theme-violet')
      
      // Add new color scheme class (only if not default)
      if (scheme !== 'default') {
        root.classList.add(`theme-${scheme}`)
      }
      
      // Save to localStorage
      localStorage.setItem('colorScheme', scheme)
    }

    applyColorScheme(colorScheme)
  }, [colorScheme])

  const handleSetColorScheme = (scheme: ColorScheme) => {
    setColorScheme(scheme)
  }

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme: handleSetColorScheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeColor() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeColor must be used within a ThemeProvider')
  }
  return context
}
