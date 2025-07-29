import { type BlogPost } from "@/data/blog-post-interface"

import { penguinFrameworkBlogPost } from "@/data/blog/penguinframework/index"
import { aeraBlogPost } from "@/data/blog/aera/index"
import { portfolioBlogPost } from "@/data/blog/portfolio/index"
import { movieSentimentsBlogPost } from "@/data/blog/moviesentiments/index" 

export const allBlogPosts: BlogPost[] = [
    penguinFrameworkBlogPost,
    aeraBlogPost,
    portfolioBlogPost,
    movieSentimentsBlogPost,
]

const postsBySlug = new Map(allBlogPosts.map(post => [post.slug, post]))

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
    return postsBySlug.get(slug)
}