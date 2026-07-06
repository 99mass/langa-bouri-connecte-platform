"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { DEFAULT_THEME, THEMES, type ThemeId } from "./theme-config"

type ThemeContextValue = {
  themeId: ThemeId
  setTheme: (id: ThemeId) => void
  theme: (typeof THEMES)[ThemeId]
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "lb-campaign-theme"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(DEFAULT_THEME)

  /* Restore persisted theme on mount */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null
    if (saved && THEMES[saved]) setThemeId(saved)
  }, [])

  /* Apply CSS vars to :root whenever theme changes */
  useEffect(() => {
    const cfg = THEMES[themeId]
    const root = document.documentElement

    // Remove all theme classes
    Object.values(THEMES).forEach((t) => root.classList.remove(t.bodyClass))
    root.classList.add(cfg.bodyClass)

    // Apply CSS vars
    Object.entries(cfg.cssVars).forEach(([prop, val]) => {
      root.style.setProperty(prop, val)
    })
  }, [themeId])

  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id)
    localStorage.setItem(STORAGE_KEY, id)
  }, [])

  return (
    <ThemeContext.Provider
      value={{ themeId, setTheme, theme: THEMES[themeId] }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
