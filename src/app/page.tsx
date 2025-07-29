"use client"

import { useState, useEffect } from "react"
import { experiences } from "@/data/experiences"
import { projects } from "@/data/projects";
import { Header } from "@/components/header"
import { Terminal } from "@/components/terminal"
import { CodeSnippet } from "@/components/code-snippet"

export default function Home() {
    const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                const timer = setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);

                return () => clearTimeout(timer);
            }
        }
    }, []); 

    return (
        <div className="min-h-screen bg-background text-text">
            <Header />
            <main className="max-w-4xl mx-auto px-6 pt-20 pb-16 space-y-16">

            <section className="space-y-8">
            <div className="space-y-4 text-lg">
                <p className="text-secondary">{"> Hello, I'm Anjola."}</p>
                <p className="text-secondary">{"> I build software systems with purpose and performance."}</p>
            </div>

            <Terminal />
            </section>

            <section id="projects" className="space-y-6">
            <h2 className="text-xl font-mono text-text">projects:</h2>

            <div className="space-y-8 ml-4">
                {projects.map((project, index) => (
                <div key={index} className="space-y-2">
                    <div className="space-y-1">
                    <p className="font-mono">
                        <span className="text-text">- name: </span>
                        <button
                        onClick={() => setSelectedProject(project)}
                        className="text-primary hover:text-accent transition-colors cursor-pointer"
                        >
                        {project.title}
                        </button>
                    </p>
                    <p className="font-mono text-secondary ml-2">tech: [{project.tags.join(", ")}]</p>
                    <p className="font-mono text-secondary ml-2">desc: &quot;{project.desc}&quot;</p>
                    <p className="font-mono ml-2">
                        <span className="text-text">code_snippet: </span>
                        <button
                        onClick={() => setSelectedProject(project)}
                        className="text-primary hover:text-accent transition-colors cursor-pointer"
                        >
                        {project.code_snippet_title}
                        </button>
                    </p>
                    </div>
                </div>
                ))}
            </div>
            </section>

            <section id="work" className="space-y-6">
                <h2 className="text-xl font-mono text-text"># work</h2>

                {experiences.map((experience, index) => (
                    <div key={index} className="space-y-2">
                        <div className="space-y-1">
                            <p className="font-mono">[[experience]]</p>
                            <p className="font-mono text-secondary ml-2">title: &quot;{experience.title}&quot;</p>
                            <p className="font-mono text-secondary ml-2">company: &quot;{experience.company}&quot;</p>
                            <p className="font-mono text-secondary ml-2">date: &quot;{experience.date}&quot;</p>
                            <p className="font-mono text-secondary ml-2">stack: [{experience.stack.join(", ")}]</p>
                            <p className="font-mono text-secondary ml-2">desc: &quot;{experience.desc}&quot;</p>
                        </div>
                    </div>
                    ))}
            
            </section>

            <section id="about" className="space-y-6">
            <h2 className="text-2xl font-mono text-text">## About Me</h2>
            <div className="font-sans text-text leading-relaxed space-y-4">
                <p>
                    I'm a software developer focused on C++ game frameworks, backend services and social media sentiment analysis, while actively exploring my interest in programming languages.
                </p>
                <p className="text-secondary font-mono text-sm">
                    // Fun fact: When I&apos;m not coding, I&apos;m lifting weights, playing cozy games, or cheering (and occasionally crying) for Arsenal.
                </p>
            </div>
            </section>

            <section id="contact" className="space-y-6">
            <h2 className="text-2xl font-mono text-text">## Contact</h2>

            <div className="space-y-2 font-mono">
                <p className="text-secondary">{"> Get in touch:"}</p>
                <p className="ml-4">
                <span className="text-text">Email: </span>
                <a href="mailto:anjola.aina@gmail.com" className="text-primary hover:text-accent transition-colors">
                    anjola.aina@gmail.com
                </a>
                </p>
                <p className="ml-4">
                <span className="text-text">GitHub: </span>
                <a href="https://github.com/anj0la" className="text-primary hover:text-accent transition-colors">
                    github.com/anj0la
                </a>
                </p>
                <p className="ml-4">
                <span className="text-text">LinkedIn: </span>
                <a href="https://linkedin.com/in/anjola-aina" className="text-primary hover:text-accent transition-colors">
                    linkedin.com/in/anjola-aina
                </a>
                </p>
            </div>
            </section>
            </main>
            {selectedProject && <CodeSnippet project={selectedProject} onClose={() => setSelectedProject(null)} />}
        </div>
    )
}