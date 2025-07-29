import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-context"
import "./globals.css";

export const metadata: Metadata = {
    title: "Anjola Aina",
    description: "A software developer focused on performance, game dev, and AI-powered sentiment analysis for social media platforms.",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" data-scroll-behavior="smooth">
        <body className="antialiased">
            <ThemeProvider>
                {children}
                </ThemeProvider>
            </body>
        </html>
    );
}