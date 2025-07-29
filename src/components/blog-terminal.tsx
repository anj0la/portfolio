"use client"

import { useState, useRef, useEffect, useCallback } from "react"
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

interface BlogTerminalProps {
    onFilter: (query: string, type: "search" | "tag") => void
    onReset: () => void
}

const PROMPT = "anjola@blog ~ %"
const MOBILE_PROMPT = "anjola@blog %"
const SMALL_PROMPT = "$ "

export function BlogTerminal({ onFilter, onReset }: BlogTerminalProps) {
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

const getPrompt = () => {
    switch (screenSize) {
        case "small": return SMALL_PROMPT
        case "medium": return MOBILE_PROMPT
        default: return PROMPT
    }
}

const getPlaceholder = () => {
    switch (screenSize) {
        case "small": return "help"
        case "medium": return "Type 'help'"
        default: return "Type 'help' for commands"
    }
}

const commands: Record<string, Command> = {
    help: {
        name: "help",
        description: "Show available commands",
        execute: () => `Available commands:
    help               - Show this help message
    search <query>     - Filter posts by title
    filter --tag <tag> - Filter posts by tag  
    home               - Go to homepage
    theme <light|dark> - Toggle site theme
    echo <message>     - Print message
    clear              - Reset all filters and clear terminal`
    },
    search: {
        name: "search",
        description: "Filter posts by title",
        usage: "search <query>",
        execute: (args) => {
            if (args.length < 2) {
                return "Usage: search <query>"
            }
            const query = args.slice(1).join(" ")
            onFilter(query, "search")
            return `Searching for posts containing: "${query}"`
        }
    },
    filter: {
        name: "filter",
        description: "Filter posts by tag",
        usage: "filter --tag <tagname>",
        execute: (args) => {
            if (args[1] !== "--tag" || !args[2]) {
                return "Usage: filter --tag <tagname>"
            }
            onFilter(args[2], "tag")
            return `Filtering posts by tag: ${args[2]}`
        }
    },
    home: {
        name: "home",
        description: "Go to homepage",
        execute: () => {
            setTimeout(() => window.location.href = "/", 500)
            return "Opening homepage..."
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
    echo: {
        name: "echo",
        description: "Print message",
        usage: "echo <message>",
        execute: (args) => args.slice(1).join(" ")
    },
    clear: {
        name: "clear",
        description: "Reset all filters and clear terminal",
        execute: () => {
            onReset()
            setHistory([])
            setInput("")
            return "Filters cleared, showing all posts"
        }
    }
}

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
    if (output && commandName !== "clear") {
        addToHistory({ type: "output", content: output })
    }
    
    setInput("")
}, [addToHistory, getPrompt])

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