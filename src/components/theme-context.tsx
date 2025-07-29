"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("dark")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem("theme") as Theme | null
        const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        const initialTheme = stored || systemPreference
        setThemeState(initialTheme)
        setMounted(true)
        document.documentElement.classList.remove("light", "dark")
        document.documentElement.classList.add(initialTheme)
    }, [])

    useEffect(() => {
        if (!mounted) return
    
        document.documentElement.classList.remove("light", "dark")
        document.documentElement.classList.add(theme)
        localStorage.setItem("theme", theme)
    }, [theme, mounted])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
    }

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" :"light")
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
        <div className={mounted ? "" : "opacity-0"} style={{ transition: "opacity 0.1s" }}>
            {children}
        </div>
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}