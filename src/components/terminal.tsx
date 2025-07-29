"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useTheme } from "@/components/theme-context"

interface TerminalLine {
    type: "input" | "output" | "error"
    content: string
}

interface Command {
    name: string
    description: string
    usage?: string
    execute: (args: string[]) => string | void
}

const PROMPT = "anjola@home ~ %"
const MOBILE_PROMPT = "anjola@home %"
const SMALL_PROMPT = "$ "

export function Terminal() {
    const [input, setInput] = useState("")
    const [history, setHistory] = useState<TerminalLine[]>([])
    const [commandHistory, setCommandHistory] = useState<string[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [screenSize, setScreenSize] = useState<"large" | "medium" | "small">("large")
    const inputRef = useRef<HTMLInputElement>(null)
    const { theme, setTheme } = useTheme()

useEffect(() => {
    const checkScreenSize = () => {
        if (window.innerWidth < 320) {
            setScreenSize("small")
        } 
        else if (window.innerWidth < 480) {
            setScreenSize("medium")
        } 
        else {
            setScreenSize("large")
        }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
}, [])

const getPrompt = useCallback(() => {
    switch (screenSize) {
        case "small": return SMALL_PROMPT
        case "medium": return MOBILE_PROMPT
        default: return PROMPT
    }
}, [screenSize])

const getPlaceholder = () => {
    switch (screenSize) {
        case "small": return "help"
        case "medium": return "Type 'help'"
        default: return "Type 'help' for commands"
    }
}

const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: "smooth" })
}, [])

const commands: Record<string, Command> = useMemo(() => ({
    help: {
        name: "help",
        description: "Show available commands",
        execute: () => `Available commands:
    help               - Show this help message
    projects           - Navigate to projects section
    work               - Navigate to work section
    about              - Navigate to about section
    contact            - Navigate to contact section
    blog               - Open blog page
    project <name>     - Open blog page for project (e.g., project penguinframework)
    theme <light|dark> - Toggle site theme (current: ${theme})
    linkedin           - Open LinkedIn profile
    github             - Open GitHub profile
    email              - Open email client
    resume             - Open resume
    echo <message>     - Print message
    clear              - Clear terminal history`
    },
    projects: {
        name: "projects", 
        description: "Navigate to projects section",
        execute: () => {
            scrollToSection("projects")
            return "Navigating to projects section..."
        }
    },
    work: {
        name: "work",
        description: "Navigate to work section",
        execute: () => {
            scrollToSection("work")
            return "Navigating to work section..."
        }
    },
    about: {
        name: "about",
        description: "Navigate to about section",
        execute: () => {
            scrollToSection("about")
            return "Navigating to about section..."
        }
    },
    contact: {
        name: "contact",
        description: "Navigate to contact section", 
        execute: () => {
            scrollToSection("contact")
            return "Navigating to contact section..."
        }
    },
    project: {
        name: "project",
        description: "Open blog page for project",
        usage: "project <name>",
        execute: (args) => {
            if (!args[1]) return "Usage: project <name>"
            setTimeout(() => window.open(`/blog/${args[1]}`, "_blank"), 500)
            return `Opening blog page for project: ${args[1]}...`
        }
    },
    theme: {
        name: "theme",
        description: "Toggle site theme",
        usage: "theme <light|dark>",
        execute: (args) => {
            if (!args[1]) {
                return `Current theme: ${theme}. Usage: theme <light|dark>`
            }
            
            if (!["light", "dark"].includes(args[1])) {
                return "Usage: theme <light|dark>"
            }
            
            const newTheme = args[1] as "light" | "dark"
            setTheme(newTheme)
            return `Theme switched to ${newTheme} mode`
        }
    },
    linkedin: {
        name: "linkedin",
        description: "Open LinkedIn profile",
        execute: () => {
            setTimeout(() => window.open("https://linkedin.com/in/anjola-aina", "_blank"), 500)
            return "Opening LinkedIn profile..."
        }
    },
    github: {
        name: "github", 
        description: "Open GitHub profile",
        execute: () => {
            setTimeout(() => window.open("https://github.com/anj0la", "_blank"), 500)
            return "Opening GitHub profile..."
        }
    },
    email: {
        name: "email",
        description: "Open email client", 
        execute: () => {
            setTimeout(() => window.location.href = "mailto:anjola.aina@gmail.com", 500)
            return "Opening email client..."
        }
    },
    resume: {
        name: "resume",
        description: "Open resume", 
        execute: () => {
            setTimeout(() => window.open("/resume.pdf", "_blank"), 500);
            return "Opening resume..."
        }
    },
    blog: {
        name: "blog",
        description: "Open blog page",
        execute: () => {
            setTimeout(() => window.location.href = "/blog", 500)
            return "Opening blog page..."
        }
    },
    echo: {
        name: "echo",
        description: "Print message",
        usage: "echo <message>",
        execute: (args) => args.slice(1).join(" ")
    },
    clear: {
        name: "clear", 
        description: "Clear terminal history",
        execute: () => {
            setHistory([])
            setInput("")
        }
    }
}), [theme, setTheme, setHistory, setInput, scrollToSection])

const addToHistory = useCallback((line: TerminalLine) => {
    setHistory(prev => [...prev, line])
}, [])

const executeCommand = useCallback((commandInput: string) => {
    const trimmed = commandInput.trim()
    if (!trimmed) return

    const args = trimmed.toLowerCase().split(" ")
    const commandName = args[0]

    setCommandHistory(prev => [...prev, commandInput])
    setHistoryIndex(-1)

    addToHistory({ type: "input", content: `${getPrompt()} ${commandInput}` })

    const command = commands[commandName]
    if (!command) {
        addToHistory({ 
            type: "error", 
            content: `Command not found: ${commandName}. Type 'help' for available commands.` 
        })
        setInput("")
        return
    }

    const output = command.execute(args)
    if (output) {
        addToHistory({ type: "output", content: output })
    }
    
    setInput("")
}, [addToHistory, getPrompt, commands])

const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
        case "Enter":
            executeCommand(input)
            break
            
        case "ArrowUp":
            e.preventDefault()
            if (commandHistory.length === 0) return
            
            const upIndex = historyIndex === -1 
            ? commandHistory.length - 1 
            : Math.max(0, historyIndex - 1)
            setHistoryIndex(upIndex)
            setInput(commandHistory[upIndex])
            break
            
        case "ArrowDown":
            e.preventDefault()
            if (historyIndex === -1) return
            
            const downIndex = historyIndex + 1
            if (downIndex >= commandHistory.length) {
                setHistoryIndex(-1)
                setInput("")
            } 
            else {
                setHistoryIndex(downIndex)
                setInput(commandHistory[downIndex])
            }
            break
    }
}, [input, executeCommand, commandHistory, historyIndex])

useEffect(() => {
    inputRef.current?.focus()
}, [])

return (
    <div className="border border-border rounded-lg p-2 sm:p-4 cursor-text font-mono text-xs sm:text-sm overflow-hidden">
    <div className="space-y-1 max-h-[300px] overflow-y-auto">
        {history.map((line, index) => (
        <div
            key={index}
            className={`whitespace-pre-wrap break-words ${
            line.type === "input" 
                ? "text-foreground" 
                : line.type === "error" 
                ? "text-primary" 
                : "text-secondary"
            }`}
        >
            {line.content}
        </div>
        ))}
            
        <div className="flex items-center min-w-0">
        <span className="text-foreground mr-1 sm:mr-2 flex-shrink-0">{getPrompt()}</span>
        <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-0 bg-transparent outline-none text-foreground caret-primary"
            placeholder={getPlaceholder()}
        />
        <span className="text-primary animate-pulse">█</span>
        </div>
    </div>
    </div>
    )
}