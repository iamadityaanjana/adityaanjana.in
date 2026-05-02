'use client'

import GitHubCalender from 'react-github-calendar';
import {ModeToggle} from "@/components/theme-toggle"
import Footer from "@/components/Footer"
import OnekoCat from "@/components/OnekoCat"
import Reach from "@/components/Reach"
import Experience from "@/components/Experience"
import Link from "next/link"
import Image from "next/image"
import ProjectsSection from '@/components/Projects'
import NowPlaying from '@/components/NowPlaying'
// import localFont from 'next/font/local'
import { Geist } from "next/font/google"
import { GithubCalendar } from "@/components/ui/github-calendar"

// const clashDisplay = localFont({ 
//   src: '../fonts/ClashDisplay-Semibold.woff2',
// })

const geistMono = Geist({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-geist-mono',
})


export default function Home() {
  return (
    <div className="min-h-screen">
      <OnekoCat />
      <div className="flex flex-col items-start px-6 md:px-12 pt-4 md:pt-6 space-y-8 md:space-y-12 max-w-3xl w-full mx-auto">
        <div className="w-full flex justify-end items-center gap-4">
          <Link href={"/projects"} className="text-md md:text-lg hover:underline">
            projects
          </Link>
          <Link href={"/blogs"} className="text-md md:text-lg hover:underline">
            blogs
          </Link>
          <Link href={"/interests"} className="text-md md:text-lg hover:underline">
            Interests
          </Link>
          <ModeToggle />
        </div>
        <div>
          <div className="flex flex-col items-start gap-4 mb-4">
            <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 relative">
              <Image
                src="/me.jpg"
                alt="Aditya Anjana"
                fill
                priority
                className="rounded-full object-cover border-2 border-neutral-300 dark:border-neutral-700"
              />
            </div>
            <div>
              <h1 className={`text-3xl md:text-4xl font-medium gap-2 dark:text-neutral-200 ${geistMono.className}`}>Aditya Anjana</h1>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-sm md:text-md text-neutral-600 dark:text-neutral-400">
                  software engineer<span className="mx-1">• developer</span> 
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <p className="text-base md:text-lg text-neutral-800 dark:text-neutral-200">    
              <span className="text-cyan-500 dark:text-cyan-400">*</span> Hey, I&apos;m Aditya<span className="text-cyan-500 dark:text-cyan-400">!
              <br />
              </span> I love building things and helping people. Started learning machine learning and AI along with web development in 2023.
              <Link href={"/interests"}> ↗</Link>
              <span className="text-cyan-500 dark:text-cyan-400"></span> 
            </p>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-md text-sm md:text-base">
                Web Dev
              </span>
              <span className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-md text-sm md:text-base">
                AI/ML
              </span>
              <span className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-md text-sm md:text-base">
                Web3
              </span>
            </div>
            
            {/* <a
              href="https://adityaanjana.in"
              className="inline-flex items-center justify-center px-3 py-2 bg-neutral-100 dark:bg-neutral-800/30 text-neutral-800 dark:text-neutral-200 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700/50 transition-colors font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={`flex items-center text-sm lg:text-base`}>
                <span>View Portfolio</span>
              </div>
            </a> */}
          </div>
        </div>

                
        <h2 className="text-xl md:text-2xl font-medium mb-8">Github Activity</h2>
        <GithubCalendar username="iamadityaanjana" />


        <div className="w-full">
          <h2 className="text-xl md:text-2xl font-medium mb-4 mt-4">Experience</h2>
          <Experience />
        </div>

        <div className="w-full">
          <ProjectsSection />
        </div>
        
        {/* <div className="w-full">
          <h2 className="text-xl md:text-2xl font-medium mb-4">Blog</h2>
          <div className="mb-4">
            <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 mb-4">
              I occasionally write about web development, AI, and other technical topics.
            </p>
            <Link 
              href="/blogs"
              className="inline-flex items-center text-base md:text-lg hover:underline"
            >
              View all posts →
            </Link>
          </div>
        </div> */}
        
        {/* <div className="w-full">
          <h2 className="text-lg font-medium mb-2">Skills</h2>
          <p className="text-xs md:text-sm font-light">
            List your technical skills and expertise
          </p>
        </div>
        <div className="w-full">
          <h2 className="text-lg font-medium mb-2">Moments</h2>
          <p className="text-xs md:text-sm font-light">
            Share significant achievements or milestones
          </p>
        </div> */}
        <div className="w-full">
          <h2 className="text-xl md:text-2xl font-medium mb-4 mt-4">Listening to</h2>
          <NowPlaying />
        </div>

        <div className="w-full">
          <h2 className="text-xl md:text-2xl font-medium mb-6 mt-4">Contact</h2>
          <Reach />
        </div>
        <div className="w-full">
          <Footer/>
        </div>
      </div>
    </div>
  );
}
