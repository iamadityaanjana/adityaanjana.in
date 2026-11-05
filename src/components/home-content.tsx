'use client'

import { ModeToggle } from "@/components/theme-toggle"
import Footer from "@/components/Footer"
import OnekoCat from "@/components/OnekoCat"
import Reach from "@/components/Reach"
import Experience from "@/components/Experience"
import Link from "next/link"
import Image from "next/image"
import ProjectsSection from '@/components/Projects'
import NowPlaying from '@/components/NowPlaying'
import { Geist } from "next/font/google"
import { GithubCalendar } from "@/components/ui/github-calendar"

const geistMono = Geist({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const BUILD_SECTIONS = [
  "nav",
  "avatar",
  "identity",
  "bio",
  "tags",
  "github",
  "experience",
  "projects",
  "music",
  "contact",
] as const

export type BuildSection = (typeof BUILD_SECTIONS)[number]

export default function HomeContent({
  showCat = true,
}: {
  showCat?: boolean
}) {
  return (
    <div className="min-h-screen">
      {showCat ? <OnekoCat /> : null}
      <div className="flex flex-col items-start px-6 md:px-12 pt-4 md:pt-6 space-y-8 md:space-y-12 max-w-3xl w-full min-w-0 mx-auto">
        <div data-build="nav" className="w-full flex justify-end items-center gap-4">
          <Link data-build="nav-projects" href={"/projects"} className="text-md md:text-lg hover:underline">
            projects
          </Link>
          <Link data-build="nav-blogs" href={"/blogs"} className="text-md md:text-lg hover:underline">
            blogs
          </Link>
          <Link data-build="nav-interests" href={"/interests"} className="text-md md:text-lg hover:underline">
            Interests
          </Link>
          <span data-build="nav-theme" className="inline-flex">
            <ModeToggle />
          </span>
        </div>
        <div>
          <div className="flex flex-col items-start gap-4 mb-4">
            <div data-build="avatar" className="w-24 h-24 md:w-32 md:h-32 shrink-0 relative">
              <Image
                src="/me.jpg"
                alt="Aditya Anjana"
                fill
                priority
                className="rounded-full object-cover border-2 border-neutral-300 dark:border-neutral-700"
              />
            </div>
            <div>
              <h1 data-build="name" className={`text-3xl md:text-4xl font-medium gap-2 dark:text-neutral-200 ${geistMono.className}`}>Aditya Anjana</h1>
              <div className="flex items-center gap-2 mt-2">
                <p data-build="role" className="text-sm md:text-md text-neutral-600 dark:text-neutral-400">
                  software engineer<span className="mx-1">• developer</span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <p data-build="bio" className="text-base md:text-lg text-neutral-800 dark:text-neutral-200">
              <span className="text-cyan-500 dark:text-cyan-400">: &#41;</span> Hey, I&apos;m Aditya<span className="text-cyan-500 dark:text-cyan-400"> !!!
              <br />
              </span> I love building things and helping people. Started learning machine learning and AI along with web development in 2023.
              <Link href={"/interests"}> ↗</Link>
              <span className="text-cyan-500 dark:text-cyan-400"></span>
            </p>

            <div data-build="tags" className="flex flex-wrap gap-2 mt-2">
              <span data-build="tag-0" className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-md text-sm md:text-base">
                Web Dev
              </span>
              <span data-build="tag-1" className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-md text-sm md:text-base">
                AI/ML
              </span>
              <span data-build="tag-2" className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-md text-sm md:text-base">
                Web3
              </span>
            </div>
          </div>
        </div>

        <div data-build="github" className="w-full min-w-0">
          <h2 data-build="github-title" className="text-xl md:text-2xl font-medium mb-4">Github Activity</h2>
          <div data-build="github-grid">
            <GithubCalendar username="iamadityaanjana" />
          </div>
        </div>

        <div data-build="experience" className="w-full">
          <h2 data-build="exp-title" className="text-xl md:text-2xl font-medium mb-4 mt-4">Experience</h2>
          <Experience />
        </div>

        <div data-build="projects" className="w-full">
          <ProjectsSection />
        </div>

        <div data-build="music" className="w-full">
          <h2 data-build="music-title" className="text-xl md:text-2xl font-medium mb-4 mt-4">Listening to</h2>
          <div data-build="now-playing">
            <NowPlaying />
          </div>
        </div>

        <div data-build="contact" className="w-full">
          <h2 data-build="contact-title" className="text-xl md:text-2xl font-medium mb-6 mt-4">Contact</h2>
          <Reach />
          <Footer/>
        </div>
      </div>
    </div>
  )
}
