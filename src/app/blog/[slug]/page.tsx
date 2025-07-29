import { Header } from "@/components/header";
import { CodeBlock } from "@/components/code-block";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allBlogPosts, getBlogPostBySlug } from "@/data/blog-posts";
import { type BlogPostSection } from "@/data/blog-post-interface";
import Image from "next/image";

export async function generateStaticParams() {
    return allBlogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);
    if (!post) {
        return {};
    }
    return {
        title: `${post.title} | Anjola Aina`,
        description: post.summary,
    };
}

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const renderSection = (section: BlogPostSection, index: number) => {
        switch (section.type) {
            case "heading":
                return <h2 key={index} className="text-2xl font-mono mt-8 mb-4 text-text"># {section.content}</h2>;

            case "heading2":
                return <h3 key={index} className="text-xl font-mono mt-6 mb-3 text-text">## {section.content}</h3>;

            case "text":
                return <p key={index} className="mb-4 leading-relaxed font-sans">{section.content}</p>;

            case "code":
                return (
                <CodeBlock key={index} language={section.language || "text"} className="my-6" github={post.github}>
                    {section.code || ""}
                </CodeBlock>
                );

            case "list":
                return (
                <ul key={index} className="mb-4 space-y-2 pl-5 list-disc font-sans">
                    {section.items?.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
                </ul>
                );

            case "quote":
                return <blockquote key={index} className="border-l-4 border-primary pl-4 italic my-6 text-secondary">{section.content}</blockquote>;

            case "image":
                return (
                <div key={index} className="my-6">
                    <Image 
                        src={section.src || ""} 
                        alt={section.alt || ""} 
                        width={800} 
                        height={400} 
                        className="w-full rounded-lg border border-gray-800" 
                    />
                    {section.caption && <p className="text-sm text-secondary text-center mt-2 font-mono">{section.caption}</p>}
                </div>
                );
                
            case "link":
                return (
                <div key={index} className="my-4">
                    <Link href={section.href || "#"} className="text-primary hover:text-accent transition-colors font-mono underline" target="_blank" rel="noopener noreferrer">
                    {section.label || section.href}
                    </Link>
                </div>
                );

            default:
                return null;
        }
  };

    return (
        <div className="min-h-screen bg-background text-text">
            <Header />
            <article className="max-w-4xl mx-auto px-6 pt-20 pb-16">
                <header className="space-y-4">
                <h1 className="text-3xl font-mono text-text">{post.title}</h1>

                <div className="flex items-center space-x-4 text-secondary text-sm font-mono">
                    <span>Published: {new Date(post.publishedAt + 'T00:00:00').toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                    {post.updatedAt && post.updatedAt !== post.publishedAt && (
                        <>
                            <span>•</span>
                            <span>Updated: {new Date(post.updatedAt + 'T00:00:00').toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                        </>
                    )}
                    <span>•</span>
                    <span>{post.readingTime} min read</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                    <Link
                        key={index}
                        href={`/blog?tag=${encodeURIComponent(tag.toLowerCase())}`}
                        className="text-secondary hover:text-primary transition-colors font-mono"
                    >
                        [{tag}]
                    </Link>
                    ))}
                </div>
            
                <p className="text-lg text-secondary leading-relaxed font-sans">
                    {post.summary}
                </p>

                {post.highlights && (
                    <div className="space-y-2">
                    <h3 className="text-sm font-mono text-text uppercase tracking-wide">Key Highlights</h3>
                    <ul className="space-y-1">
                        {post.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start text-sm">
                            <span className="text-primary mr-2 font-mono">•</span>
                            <span className="text-secondary">{highlight}</span>
                        </li>
                        ))}
                    </ul>
                    </div>
                )}
                </header>

                <div className="space-y-6">
                    {post.sections.map((section, index) => renderSection(section, index))}
                </div>

                <footer className="border-t border-border pt-8 mt-12">
                <Link href="/blog" className="inline-flex items-center text-primary hover:text-accent transition-colors font-mono">
                    ← Back to Blog
                </Link>
                </footer>
            </article>
        </div>
    );
}