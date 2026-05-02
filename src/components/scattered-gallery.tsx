"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface ImagePosition {
  x?: number // percentage offset from center
  y?: number // percentage offset from center
  rotation?: number // degrees
  scale?: number // scale factor
}

interface ScatteredGalleryProps {
  images: Array<{
    id: string
    src: string
    alt?: string
    position?: ImagePosition
  }>
  onImageClick?: (id: string) => void
  containerClassName?: string
}

export function ScatteredGallery({ images, onImageClick, containerClassName = "" }: ScatteredGalleryProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Default rotations and scales for fallback
  const defaultRotations = [-12, -8, -5, -3, 0, 3, 5, 8, 12, -10, 6, -6]
  const defaultScales = [0.85, 0.95, 1, 0.9, 1.05, 0.8, 1.1, 0.88, 1.02, 0.92, 0.98, 0.87]
  
  // Mobile scale multiplier to reduce image sizes on mobile
  const mobileScaleMultiplier = 0.99

  // Get image position - use provided position or default
  const getImagePosition = (image: ScatteredGalleryProps['images'][0], index: number): ImagePosition => {
    if (image.position) {
      return {
        x: image.position.x ?? 0,
        y: image.position.y ?? 0,
        rotation: image.position.rotation ?? defaultRotations[index % defaultRotations.length],
        scale: image.position.scale ?? defaultScales[index % defaultScales.length],
      }
    }
    
    // Default positions if not provided
    const seed = index * 137.508
    const angle = seed * Math.PI / 180
    const radius = 25 + (index % 3) * 10
    const randomOffset = (index % 5) * 6 - 12
    const x = Math.cos(angle) * radius + randomOffset
    const y = Math.sin(angle) * radius + randomOffset
    
    return { 
      x, 
      y, 
      rotation: defaultRotations[index % defaultRotations.length],
      scale: defaultScales[index % defaultScales.length]
    }
  }

  return (
    <div
      className={`relative w-full flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 overflow-visible rounded-lg ${containerClassName}`}
    >
      {/* Board container - fixed size, allows overflow */}
      <div className="relative w-full max-w-3xl aspect-video overflow-visible">
        {/* Background board */}
        <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-3xl shadow-lg border border-neutral-200 dark:border-neutral-700"></div>

        {/* Gallery container - no padding, allows images to overflow board */}
        <div className="absolute inset-0 z-10 overflow-visible">
          {images.map((image, index) => {
            const position = getImagePosition(image, index)
            // Apply mobile scale reduction
            const finalScale = isMobile 
              ? (position.scale || 1) * mobileScaleMultiplier 
              : (position.scale || 1)

            return (
              <div
                key={image.id}
                className="absolute cursor-pointer"
                style={{
                  left: `calc(50% + ${position.x}%)`,
                  top: `calc(50% + ${position.y}%)`,
                  transform: `translate(-50%, -50%) rotate(${position.rotation}deg) scale(${finalScale})`,
                  zIndex: index,
                }}
                onClick={() => onImageClick?.(image.id)}
              >
                <div className="relative transition-all duration-300 hover:shadow-xl hover:scale-105">
                  {/* Image card with polaroid style */}
                  <div className="bg-white dark:bg-neutral-800 rounded-sm shadow-lg overflow-hidden border-2 md:border-4 lg:border-8 border-white dark:border-neutral-700">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-52 md:h-52">
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt || "Gallery image"}
                        fill
                        className="object-cover w-full h-full"
                        sizes="(max-width: 640px) 128px, (max-width: 768px) 192px, 288px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

