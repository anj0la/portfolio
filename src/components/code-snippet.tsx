"use client"

import { useState } from "react"
import { X, ExternalLink, ArrowRight } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { customDarkTheme, customLightTheme } from "@/styles/syntax-themes"
import { useTheme } from "@/components/theme-context"

interface Project {
  slug: string
  title: string
  tags: string[]
  desc: string
  language: string
  code_snippet: string
  github: string
}

interface CodeSnippetProps {
  project: Project
  onClose: () => void
}

export function CodeSnippet({ project, onClose }: CodeSnippetProps) {
    const [isHovered, setIsHovered] = useState(false)
    const { theme } = useTheme()

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
        onClose()
        }
    }

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

    const syntaxLanguage = getLanguageCode(project.language)
    const syntaxTheme = theme === "dark" ? customDarkTheme : customLightTheme

    return (
        <div 
        className="code-block-container fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" 
        onClick={handleBackdropClick}
        >
        <div
            className={`bg-card rounded-lg border border-border max-w-4xl w-full max-h-[90vh] overflow-hidden transition-all duration-200 relative ${
            isHovered ? "border-primary shadow-lg shadow-primary/20" : "border-gray-700"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >

            <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
            <span className="text-xs text-secondary uppercase tracking-wide">
                {project.language.toUpperCase()}
            </span>
            <button 
                onClick={onClose} 
                className="text-primary hover:text-accent transition-colors"
            >
                <X size={16} />
            </button>
            </div>

            <div className="overflow-auto max-h-[calc(90vh-120px)] bg-muted">
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
                {project.code_snippet}
            </SyntaxHighlighter>
            </div>

            <div 
            className={`absolute bottom-4 right-4 flex items-center space-x-3 transition-all duration-200 ${
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
            }`}
            >
            <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center sm:space-x-2 bg-border/80 hover:bg-border px-3 py-2 rounded transition-colors text-foreground text-sm"
            >
                <ExternalLink size={14} />
                <span className="hidden sm:inline sm:ml-2">View Source</span>
            </a>
            <a
                href={`/notes/${project.slug}`}
                className="flex items-center sm:space-x-2 bg-primary hover:bg-primary/80 px-3 py-2 rounded transition-colors text-foreground text-sm"
            >
                <ArrowRight size={14} />
                <span className="hidden sm:inline sm:ml-2">Read Case Study</span>
            </a>
            </div>
        </div>
        </div>
    )
}