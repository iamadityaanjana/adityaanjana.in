'use client'

import { BlogContent } from '@/components/BlogContent'
import Link from 'next/link'
import OnekoCat from '@/components/OnekoCat'
import { ModeToggle } from '@/components/theme-toggle'
import { BlogPost } from '@/types/blog'

interface BlogPostClientProps {
  blog: BlogPost
}

export default function BlogPostClient({ blog }: BlogPostClientProps) {
  return (
    <div className="min-h-screen">
      <OnekoCat />
      <div className="flex flex-col items-start px-6 md:px-12 lg:ml-100 pt-4 md:pt-6 space-y-8 md:space-y-12 max-w-3xl mx-auto">
        <div className="w-full flex justify-end items-center">
          <ModeToggle />
        </div>
        <div className="w-full">
          <Link 
            href="/blogs" 
            className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 inline-flex items-center hover:underline transition-colors"
          >
            <span className="mr-2">←</span>
            <span>Back to blogs</span>
          </Link>
          <BlogContent blog={blog} />
        </div>
      </div>
    </div>
  )
}