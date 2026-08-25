"use client"

import * as React from "react"
import { flushSync } from "react-dom"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const transitioning = React.useRef(false)

  const applyTheme = (nextTheme: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", nextTheme === "dark")
    document.documentElement.style.colorScheme = nextTheme
    flushSync(() => {
      setTheme(nextTheme)
    })
  }

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (transitioning.current) return

    const nextTheme = resolvedTheme === "dark" ? "light" : "dark"
    const button = buttonRef.current

    if (
      !button ||
      typeof document.startViewTransition !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      applyTheme(nextTheme)
      return
    }

    const rect = button.getBoundingClientRect()
    const fromPointer = event.clientX !== 0 || event.clientY !== 0
    const x = fromPointer ? event.clientX : rect.left + rect.width / 2
    const y = fromPointer ? event.clientY : rect.top + rect.height / 2
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const root = document.documentElement
    root.style.setProperty("--vt-x", `${x}px`)
    root.style.setProperty("--vt-y", `${y}px`)
    root.style.setProperty("--vt-r", `${maxRadius}px`)

    transitioning.current = true

    try {
      const transition = document.startViewTransition(() => {
        applyTheme(nextTheme)
      })

      transition.finished.finally(() => {
        transitioning.current = false
      })
    } catch {
      transitioning.current = false
      applyTheme(nextTheme)
    }
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      aria-label="Toggle theme"
      className={cn(buttonVariants({ variant: "outline", size: "icon" }), "relative z-50")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
