import { Header } from "@/components/header"
import { allBlogPosts } from "@/data/blog-posts"
import { BlogList } from "@/components/blog-list" 

export const metadata = {
    title: "Blog | Anjola Aina",
    description: "A collection of technical blog posts, case studies, and thoughts on software development.",
}

export default function BlogPage() {
    const allPosts = allBlogPosts.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

    return (
        <div className="min-h-screen bg-background text-text">
            <Header />

        <main className="max-w-4xl mx-auto px-6 pt-20 pb-16 space-y-8">
            <h1 className="text-2xl font-mono text-text">## Blog</h1>
            <BlogList allPosts={allPosts} />
        </main>
        </div>
    )
}