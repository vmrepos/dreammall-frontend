import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "light" | "dark"

type ThemeContextType = {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const STORAGE_KEY = "dreammall-theme"

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light"

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === "light" || stored === "dark") return stored

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.style.colorScheme = theme
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const initial = getInitialTheme()
    applyTheme(initial)
    return initial
  })

  useEffect(() => {
    applyTheme(theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const setTheme = (next: Theme) => setThemeState(next)
  const toggleTheme = () => setThemeState((current) => (current === "dark" ? "light" : "dark"))

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === "dark", toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
