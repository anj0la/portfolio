"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { customDarkTheme, customLightTheme } from "@/styles/syntax-themes"
import { useTheme } from "@/components/theme-context"

interface CodeBlockProps {
    language?: string
    children: string
    className?: string
    github?: string
}

export function CodeBlock({ language = "text", children, className = "", github }: CodeBlockProps) {
    const [isHovered, setIsHovered] = useState(false)
    const { theme } = useTheme()

    const getLanguageCode = (lang: string) => {
        const languageMap: Record<string, string> = {
            "cpp": "cpp",
            "c++": "cpp",
            "ts": "typescript",
            "tsx": "tsx",
            "js": "javascript",
            "jsx": "jsx",
            "py": "python",
        }
        
        return languageMap[lang.toLowerCase()] || lang.toLowerCase()
    }

    const syntaxLanguage = getLanguageCode(language)
    const syntaxTheme = theme === "dark" ? customDarkTheme : customLightTheme

    return (
        <div 
            className={`code-block-container rounded-lg border overflow-hidden transition-all duration-200 relative ${
                isHovered ? "border-primary shadow-lg shadow-primary/20" : "border-border"
            } ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >

            <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
                <span className="text-xs text-secondary uppercase tracking-wide">
                    {language.toUpperCase()}
                </span>
            </div>


            <div className="bg-card overflow-x-auto">
                <SyntaxHighlighter
                    language={syntaxLanguage}
                    style={syntaxTheme}
                    customStyle={{
                        margin: 0,
                        padding: "1rem",
                        background: "transparent",
                        fontSize: "0.875rem",
                    }}
                    showLineNumbers={false}
                    wrapLines={true}
                    wrapLongLines={true}
                >
                    {children}
                </SyntaxHighlighter>
            </div>

            {github && (
                <div 
                    className={`absolute bottom-4 right-4 transition-all duration-200 ${
                        isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                    }`}
                >
                    <a
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center sm:space-x-2 bg-primary hover:bg-primary/80 px-3 py-2 rounded transition-colors text-background text-sm"
                    >
                        <ExternalLink size={14} />
                        <span className="hidden sm:inline sm:ml-2">View Source</span>
                    </a>
                </div>
            )}
        </div>
    )
}