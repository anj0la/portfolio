import { CSSProperties } from "react"

export const customDarkTheme: { [key: string]: CSSProperties } = {
    'code[class*="language-"]': {
        color: "#cfcfcfff",
        fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
        direction: "ltr" as const,
        textAlign: "left" as const,
        whiteSpace: "pre" as const,
        wordSpacing: "normal" as const,
        wordBreak: "normal" as const,
        lineHeight: "1.5",
        MozTabSize: 4,
        OTabSize: 4,
        tabSize: 4,
        WebkitHyphens: "none" as const,
        MozHyphens: "none" as const,
        msHyphens: "none" as const,
        hyphens: "none" as const,
    },
    'pre[class*="language-"]': {
        color: "#cfcfcfff",
        fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
        direction: "ltr" as const,
        textAlign: "left" as const,
        whiteSpace: "pre" as const,
        wordSpacing: "normal" as const,
        wordBreak: "normal" as const,
        lineHeight: "1.5",
        MozTabSize: 4,
        OTabSize: 4,
        tabSize: 4,
        WebkitHyphens: "none" as const,
        MozHyphens: "none" as const,
        msHyphens: "none" as const,
        hyphens: "none" as const,
        padding: "1em",
        margin: "0.5em 0",
        overflow: "auto" as const,
        background: "#111111",
    },
    comment: {
        color: "#999999",
        fontStyle: "italic",
    },
    prolog: {
        color: "#999999", 
        fontStyle: "italic",
    },
    cdata: {
        color: "#999999", 
        fontStyle: "italic",
    },
    keyword: {
        color: "#e63946",
    },
    selector: {
        color: "#e63946",
    },
    important: {
        color: "#e63946",
    },
    atrule: {
        color: "#e63946", 
    },
    operator: {
        color: "#999999", 
    },
    punctuation: {
        color: "#999999",
    },
    delimiter: {
        color: "#999999",
    },
    "class-name": {
        color: "#fabd2f", 
    },
    tag: {
        color: "#fabd2f", 
    },
    builtin: {
        color: "#fabd2f",
    },
    function: {
        color: "#ff8235ff", 
    },
    method: {
        color: "#ff8235ff",
    },

    property: {
        color: "#f1faee",
    },
    variable: {
        color: "#f1faee",
    },
    string: {
        color: "#ff8c61",
    },
    char: {
        color: "#ff8c61",
    },
    number: {
        color: "#ff8c61",
    },
    boolean: {
        color: "#ff8c61",
    },
    constant: {
        color: "#ff8c61",
    },
    symbol: {
        color: "#ff8c61",
    },
    url: {
        color: "#ff6b35",
        textDecoration: "underline",
    },
    regex: {
        color: "#ff8c61",
    },

    bold: {
        fontWeight: "bold",
    },
    italic: {
        fontStyle: "italic",
    },
    inserted: {
        backgroundColor: "rgba(255, 107, 53, 0.2)",
    },
    deleted: {
        backgroundColor: "rgba(230, 57, 70, 0.2)",
    },
    };

    export const customLightTheme: { [key: string]: CSSProperties } = {
    'code[class*="language-"]': {
        color: "#1a1a1a",
        fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
        direction: "ltr" as const,
        textAlign: "left" as const,
        whiteSpace: "pre" as const,
        wordSpacing: "normal" as const,
        wordBreak: "normal" as const,
        lineHeight: "1.5",
        MozTabSize: 4,
        OTabSize: 4,
        tabSize: 4,
        WebkitHyphens: "none" as const,
        MozHyphens: "none" as const,
        msHyphens: "none" as const,
        hyphens: "none" as const,
    },
    'pre[class*="language-"]': {
        color: "#1a1a1a",
        fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
        direction: "ltr" as const,
        textAlign: "left" as const,
        whiteSpace: "pre" as const,
        wordSpacing: "normal" as const,
        wordBreak: "normal" as const,
        lineHeight: "1.5",
        MozTabSize: 4,
        OTabSize: 4,
        tabSize: 4,
        WebkitHyphens: "none" as const,
        MozHyphens: "none" as const,
        msHyphens: "none" as const,
        hyphens: "none" as const,
        padding: "1em",
        margin: "0.5em 0",
        overflow: "auto" as const,
        background: "#ffffff",
    },
    comment: {
        color: "#666666",
        fontStyle: "italic",
    },
    prolog: {
        color: "#666666",
        fontStyle: "italic",
    },
    cdata: {
        color: "#666666",
        fontStyle: "italic",
    },
    keyword: {
        color: "#d62828", 
    },
    selector: {
        color: "#d62828", 
    },
    important: {
        color: "#d62828",
    },
    atrule: {
        color: "#d62828", 
    },

    operator: {
        color: "#555555", 
    },
    punctuation: {
        color: "#555555", 
    },
    delimiter: {
        color: "#555555", 
    },

    "class-name": {
        color: "#c77e02",
    },
    tag: {
        color: "#c77e02", 
    },
    builtin: {
        color: "#c77e02", 
    },
    function: {
        color: "#f86f1c",
    },
    method: {
        color: "#f86f1c",
    },
    property: {
        color: "#1a1a1a",
    },
    variable: {
        color: "#1a1a1a", 
    },
    string: {
        color: "#e55100",
    },
    char: {
        color: "#e55100",
    },
    number: {
        color: "#e55100",
    },
    boolean: {
        color: "#e55100",
    },
    constant: {
        color: "#e55100",
    },
    symbol: {
        color: "#e55100",
    },
    url: {
        color: "#f86f1c", 
        textDecoration: "underline",
    },
    regex: {
        color: "#e55100",
    },
    bold: {
        fontWeight: "bold",
    },
    italic: {
        fontStyle: "italic",
    },
    inserted: {
        backgroundColor: "rgba(248, 111, 28, 0.2)", 
    },
    deleted: {
        backgroundColor: "rgba(214, 40, 40, 0.2)", 
    },
};