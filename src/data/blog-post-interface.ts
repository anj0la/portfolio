export interface BlogPostSection {
    type: "text" | "code" | "heading" | "heading2" | "list" | "quote" | "image" | "link";
    content?: string;      
    code?: string;          
    language?: string;     
    items?: string[];       
    src?: string;           
    alt?: string;           
    href?: string;         
    label?: string;         
    caption?: string;
}

export interface BlogPost {
    slug: string;            
    title: string;
    publishedAt: string;
    updatedAt?: string;
    readingTime: string;
    summary: string;        
    tags: string[];
    highlights?: string[];     
    sections: BlogPostSection[];
    github: string;             
}