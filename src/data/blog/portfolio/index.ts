import { type BlogPost } from "../../blog-post-interface";

export const portfolioBlogPost: BlogPost = {
    slug: "portfolio",
    title: "Portfolio Website",
    publishedAt: "2025-07-26",
    updatedAt: "2025-07-29",
    readingTime: "6",
    tags: ["TypeScript", "Next.js", "Tailwind"],
    summary: "A complete redesign of my portfolio website, moving from vanilla HTML/CSS to Next.js with a terminal-inspired design.",
    sections: [
        {
            type: "heading",
            content: "Context"
        },
        {
            type: "text",
            content: "I had created my first iteration of my portfolio website back in 2023, using HTML, vanilla CSS and very minimal JavaScript. I had taken what I learned from a Web Development course to build the website. However, its design was not responsive and worked horribly on mobile devices. The design was also not accessible as I used white text on a light background."
        },
        {
            type: "text",
            content: "In April of this year, I decided to redesign my portfolio website. I went for a minimalistic look, as my CSS skills are at best intermediate. I still stuck to plain HTML and pure CSS/JavaScript. The website was static, and I added a light and dark theme. The design was much more responsive and worked well on mobile devices."
        },
        {
            type: "text",
            content: "However, there was still a big issue with this new website design. It was honestly boring. There was nothing interesting or special about the website. Recruiters would take one look at the website and leave."
        },
        {
            type: "text",
            content: "Since it was the summer, and I had a lot of free time, I decided that I needed to sit down and really make my portfolio stand out and fix its issues."
        },
        {
            type: "heading",
            content: "Technical Approach"
        },
        {
            type: "heading2",
            content: "Design Philosophy"
        },
        {
            type: "text",
            content: "I decided on keeping a minimalist approach to the design to overcome my shortcomings with web design. I'm a Software Developer, so web design is something I'm still trying to become more comfortable with."
        },
        {
            type: "text",
            content: "So, I went with a minimalist, dev-centric portfolio inspired by modern code editors and terminals. The design prioritized content and interactivity over decorative UI, with a simulated terminal for navigation and discovery."
        },
        {
            type: "text",
            content: "My colour palette was high-contrast and used red as a powerful, deliberate accent:"
        },
        {
            type: "list",
            items: [
                "Deep, near-black for the main canvas",
                "Off-white for body copy and primary content", 
                "Gray for metadata, comments, and less important text",
                "Primary Red, the signature color for links, highlights, interactive elements, and command outputs",
                "Accent Orange, used sparingly for special highlights or status indicators"
            ]
        },
        {
            type: "heading2",
            content: "Tech Stack Decision"
        },
        {
            type: "text",
            content: "I scrapped the vanilla approach and went with a framework. The tech stack I settled with was: Next.js, Tailwind CSS, and TypeScript."
            },
        {
            type: "text",
            content: "Next.js felt overwhelming at first with its folder conventions and routing magic, but after looking at some starter projects, I found a structure that worked well for me."
        },
        {
            type: "text",
            content: "Honestly though, being able to generate dynamic HTML instead of copy-pasting everything was truly the real game-changer. Creating data objects and mapping through them to generate components felt so much better compared to my old static HTML approach."
        },
        {
            type: "code",
            language: "typescript",
            code: `export const experiences = [
    {
        title: "Junior Software Developer",
        company: "Areto Labs",
        date: "May 2023 - Aug 2023",
        stack: ["Python", "SQL", "GCP"],
        desc: "Built a YouTube comment scraper and developed backend REST APIs for a moderation platform. Implemented uptime monitoring and Docker-based testing.",  
    },
    {
        title: "Research Assistant",
        company: "University of Alberta",
        date: "May 2022 - Aug 2022",
        stack: ["Python", "Streamlit", "Material UI"],
        desc: "Developed a machine learning interface to connect models with a user-facing dashboard, with modular design and clear visualizations.",
    },
]`
        },
        {
            type: "code",
            language: "tsx",
            code: `<section id="work" className="space-y-6">
    <h2 className="text-xl font-mono text-text"># work</h2>

    {experiences.map((experience, index) => (
        <div key={index} className="space-y-2">
        <div className="space-y-1">
            <p className="font-mono">[[experience]]</p>
            <p className="font-mono text-secondary ml-2">title: "{experience.title}"</p>
            <p className="font-mono text-secondary ml-2">company: "{experience.company}"</p>
            <p className="font-mono text-secondary ml-2">date: "{experience.date}"</p>
            <p className="font-mono text-secondary ml-2">stack: [{experience.stack.join(", ")}]</p>  
            <p className="font-mono text-secondary ml-2">desc: "{experience.desc}"</p>
        </div>
        </div>
    ))}
    </section>`
        },
        {
            type: "heading2",
            content: "Terminal Implementation"
        },
        {
            type: "text",
            content: "The terminal uses a Record consisting of the command name and the Command:"
        },
        {
            type: "code",
            language: "typescript",
            code: `interface Command {
    name: string
    description: string
    usage?: string
    execute: (args: string[]) => string | void 
    }`
        },
        {
            type: "text",
            content: "The executeCommand adds the command to the terminal history, and executes the command from the commands record:"
        },
        {
            type: "code",
            language: "typescript",
            code: `export const executeCommand = useCallback((commandInput: string) => {
    const trimmed = commandInput.trim()
    if (!trimmed) return

    const args = trimmed.toLowerCase().split(" ")
    const commandName = args[0]

    setCommandHistory(prev => [...prev, commandInput])
    setHistoryIndex(-1)
    addToHistory({ type: "input", content: \`\${PROMPT} \${commandInput}\` })

    const command = commands[commandName]
    if (!command) {
        addToHistory({ 
        type: "error", 
        content: \`Command not found: \${commandName}. Type 'help' for available commands.\`   
        })
        setInput("")
        return
    }

    const output = command.execute(args)
    if (output) {
        addToHistory({ type: "output", content: output })
    }`
        },
        {
            type: "text",
            content: "The terminal for the notes section works similarly with extra functionality for filtering and searching posts."
        },
        {
            type: "heading",
            content: "Implementation"
        },
        {
            type: "text",
            content: "I started with the main page structure since it was going to be a single-page site. I built out the Home() component and added each section one by one (projects, work, about, contacts). Once I had the basic layout working, I worked on building the interactive terminal component."
        },
        {
            type: "text",
            content: "Honestly, the learning curve was harder than I expected. Using Next.js, Tailwind, and TypeScript all at once while trying to build something that didn't look terrible was really overwhelming. However, pushing through it proved to myself that I can actually pick up new tech pretty quickly when I need to. Having that solid foundation in vanilla HTML, CSS, and JavaScript also really saved me. It made it much easier to understand what these frameworks do under the hood."
        },
        {
            type: "heading",
            content: "Outcomes"
        },
        {
            type: "text",
            content: "I think the biggest outcome though was having a super cool website, don't you think?"
        },
        {
            type: "text",
            content: "Moving from vanilla HTML/CSS to Next.js with TypeScript and Tailwind was 100% intimidating, but it showed me that having solid fundamentals makes learning new frameworks much easier. Also, the terminal-inspired design gives the portfolio personality and interactivity that actually makes recruiters stick around."
        },
        {
            type: "text",
            content: "The responsive design works (finally!!!) properly on mobile, accessibility is much better, and the overall user experience is something I'm really proud to show off. Plus, the modular structure makes it easy to add new projects and update content without rewriting everything from scratch."
        }
    ],
    github: "https://github.com/anj0la/portfolio"
};