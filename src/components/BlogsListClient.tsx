'use client'

import { BlogCard } from '@/components/BlogCard'
import Link from 'next/link'
import OnekoCat from '@/components/OnekoCat'
import { ModeToggle } from '@/components/theme-toggle'
import { BlogPost } from '@/types/blog'

interface BlogsListClientProps {
  blogs: BlogPost[]
}

export default function BlogsListClient({ blogs }: BlogsListClientProps) {
  return (
    <div className="min-h-screen">
      <OnekoCat />
      <div className="flex flex-col items-start px-6 md:px-12 lg:ml-100 pt-4 md:pt-6 space-y-8 md:space-y-12 max-w-3xl mx-auto">
        <div className="w-full flex justify-end items-center">
          <ModeToggle />
        </div>
        <div className="w-full">
          <div className="mb-10">
            <Link 
              href="/" 
              className="text-sm md:text-base mb-4 inline-block hover:underline"
            >
              ← Back to home
            </Link>
            <h1 className="text-3xl md:text-4xl font-medium mb-4">blogs</h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              Technical writings and thoughts on web development, AI, and more.
            </p>
          </div>
          
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 gap-8">
              {blogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-neutral-600 dark:text-neutral-400">
                Blog posts coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}