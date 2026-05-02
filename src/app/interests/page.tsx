'use client'

import Link from 'next/link'
import OnekoCat from '@/components/OnekoCat'
import { ModeToggle } from '@/components/theme-toggle'
import { ScatteredGallery } from "@/components/scattered-gallery"

const DEMO_IMAGES = [
  {
    id: "1",
    src: "/images/interests/no-thanks-ai.png",
    alt: "no thanks i use ai",
    position: { x: -38, y: -38, rotation: -8, scale: 0.7 },
  },
  {
    id: "2",
    src: "/images/interests/math-cat.png",
    alt: "math cat",
    position: { x: 44, y: -40, rotation: 12, scale: 0.7 },
  },
  {
    id: "3",
    src: "/images/interests/music-glow.png",
    alt: "music vibes",
    position: { x: -38, y: 3, rotation: 2, scale: 0.75 },
  },
  {
    id: "4",
    src: "/images/interests/hacker.png",
    alt: "hacker mode",
    position: { x: -10, y: -30, rotation: 8, scale: 0.75 },
  },
  {
    id: "5",
    src: "/images/interests/travel.png",
    alt: "i wanna travel the world",
    position: { x: 0, y: 0, rotation: -3, scale: 0.75 },
  },
  {
    id: "6",
    src: "/images/interests/tinkering.png",
    alt: "tinkering with hardware",
    position: { x: 30, y: 30, rotation: 7, scale: 0.75 },
  },
  {
    id: "7",
    src: "/images/interests/music-therapy.png",
    alt: "music is my therapy",
    position: { x: -20, y: 38, rotation: -6, scale: 0.7 },
  },
  {
    id: "8",
    src: "/images/interests/nasa.png",
    alt: "nasa",
    position: { x: 15, y: -10, rotation: 4, scale: 0.75 },
  },
]

export default function InterestsPage() {
  const handleImageClick = (id: string) => {
    console.log(`Clicked image: ${id}`)
  }
  return (
    <div className="min-h-screen">
      <OnekoCat />
      <div className="flex flex-col items-start px-6 md:px-12 lg:ml-100 pt-4 md:pt-6 space-y-8 md:space-y-12 max-w-3xl mx-auto">
        {/* Theme toggle button */}
        <div className="w-full flex justify-end items-center">
          <ModeToggle />
        </div>

        {/* Header section */}
        <div className="w-full">
          <div className="mb-10">
            <Link
              href="/"
              className="text-sm md:text-base mb-4 inline-block hover:underline"
            >
              ← Back to home
            </Link>
            <h1 className="text-3xl md:text-4xl font-medium mb-4">Interests</h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              A glimpse into what I enjoy and explore beyond work.
            </p>
          </div>
          <div className="w-full my-8">
            <ScatteredGallery images={DEMO_IMAGES} onImageClick={handleImageClick} />
          </div>

          <div className="space-y-4 text-lg md:text-xl text-neutral-700 dark:text-neutral-300">
            {/* <p className="flex gap-2 text-lg md:text-xl text-neutral-700 dark:text-neutral-300">
              
              
              Over the past year or so, I've been exploring all kinds of stuff related to Ai and Machine Learning

              Apart from ML, I'm also into a bunch of other areas - basically anything in software that's cool and fun to mess around with.

              Right now, I'm working on backend development and learning how to build ai agents.

            </p> */}


          </div>
        </div>
      </div>
    </div>
  )
}

