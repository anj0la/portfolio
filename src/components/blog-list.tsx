"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { BlogTerminal } from "@/components/blog-terminal"
import { type BlogPost } from "@/data/blog-post-interface"

function BlogListContent({ allPosts }: { allPosts: BlogPost[] }) {
    const [filteredPosts, setFilteredPosts] = useState(allPosts)

    const searchParams = useSearchParams()
    const router = useRouter() 

    useEffect(() => {
        const tagFromUrl = searchParams.get("tag")

        if (tagFromUrl) {
            const filtered = allPosts.filter((post) =>
                post.tags.some((tag) => tag.toLowerCase() === tagFromUrl.toLowerCase())
        )
            setFilteredPosts(filtered)
        } 
        else {
            setFilteredPosts(allPosts)
        }
    }, [searchParams, allPosts]) 

    const handleFilter = (query: string, type: "search" | "tag") => {
        if (!query) {
            resetFilter()
            return
        }

        if (type === "tag") {
            router.push(`/blog?tag=${query.toLowerCase()}`)
        } 
        else {
            router.push("/blog")
            const filtered = allPosts.filter((post) =>
                post.title.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredPosts(filtered);
        }
    }

    const resetFilter = () => {
        router.push("/blog")
    }

    return (
        <>
            <BlogTerminal onFilter={handleFilter} onReset={resetFilter} />

            <div className="space-y-4">
            {filteredPosts.map((post, index) => (
                <Link
                    key={index}
                    href={`/blog/${post.slug}`}
                    className="block hover:text-primary transition-colors group font-mono"
                >
                    <div className="flex items-center justify-between py-2">
                    <span className="group-hover:text-primary transition-colors">{post.title}</span>
                    <span className="text-secondary">[{post.tags.join(", ")}]</span>
                    </div>
                </Link>
            ))}
            </div>
            {filteredPosts.length === 0 && (
                <div className="text-center py-12 text-secondary font-mono">
                    <p>No posts found matching your criteria.</p>
                    <button onClick={resetFilter} className="text-primary hover:text-accent transition-colors mt-2">
                        Clear filters
                    </button>
                </div>
            )}
        </>
    )
}

export function BlogList({ allPosts }: { allPosts: BlogPost[] }) {
    return (
        <Suspense fallback={<div className="text-secondary font-mono">Loading posts...</div>}>
            <BlogListContent allPosts={allPosts} />
        </Suspense>
    )
}