import { FC } from 'react'
import Link from 'next/link'
import { BlogPost } from '@/types/blog'

interface BlogCardProps {
  blog: BlogPost
}

export const BlogCard: FC<BlogCardProps> = ({ blog }) => {
  return (
    <Link href={`/blogs/${blog.id}`}>
      <article className="border-b border-neutral-500 dark:border-neutral-800 pb-8 hover:bg-neutral-100 dark:hover:bg-neutral-900/50 transition-colors p-4 -mx-4 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
          <h2 className="text-xl md:text-2xl font-medium">{blog.title}</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{blog.date}</span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{blog.readTime}</span>
          </div>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4 text-base md:text-lg">{blog.description}</p>
        <div className="flex flex-wrap gap-2">
          {blog.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  )
}
