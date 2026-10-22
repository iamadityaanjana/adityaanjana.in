"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

const COLORS = [
  "#FFD200",
  "#FF2D55",
  "#32D74B",
  "#64D2FF",
  "#BF5AF2",
  "#FFFFFF",
  "#FF9F0A",
  "#FF375F",
]
const SPEED = 150

function DvdMark() {
  return (
    <svg
      viewBox="0 0 1058.4 465.84"
      xmlns="http://www.w3.org/2000/svg"
      className="block w-full h-auto"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="m91.053 0-13.719 57.707 102.28 0.039063h24c65.747 0 105.91 26.44 94.746 73.4-12.147 51.133-69.613 73.4-130.67 73.4h-22.947l29.787-125.45h-102.27l-43.521 183.2h145.05c109.07 0 212.76-57.573 231.01-131.15 3.3467-13.507 2.8806-47.253-5.3594-67.359-0.21299-0.787-0.42594-1.4-1.1855-3-0.293-0.653-0.56012-3.6412 1.1465-4.2812 0.947-0.36 2.7069 1.4944 2.9336 2.041 0.853 2.24 1.5059 3.9062 1.5059 3.9062l92.293 260.6 234.97-265.21 99.535-0.089844h24c65.76 0 106.25 26.44 95.092 73.4-12.147 51.133-69.947 73.4-131 73.4h-22.959l29.799-125.47h-102.27l-43.533 183.21h145.07c109.05 0 213.48-57.4 231-131.15 17.52-73.75-59.107-131.15-168.69-131.15h-216.4s-57.319 67.88-67.959 80.693c-57.12 68.787-67.241 87.226-68.961 91.986 0.24-4.8-1.8138-23.412-26.174-92.959-6.48-18.52-27.359-79.721-27.359-79.721h-389.25zm408.77 324.16c-276.04 0-499.83 31.72-499.83 70.84s223.79 70.84 499.83 70.84c276.04 0 499.83-31.72 499.83-70.84s-223.79-70.84-499.83-70.84zm-18.094 48.627c63.04 0 114.13 10.573 114.13 23.613s-51.095 23.613-114.13 23.613c-63.027 0-114.13-10.573-114.13-23.613s51.106-23.613 114.13-23.613z"
      />
    </svg>
  )
}

export default function DvdPage() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 40, y: 40 })
  const vel = useRef({ x: SPEED, y: SPEED })
  const size = useRef({ w: 180, h: 248 })
  const colorIndex = useRef(0)
  const [color, setColor] = useState(COLORS[0])
  const [ready, setReady] = useState(false)

  const measure = useCallback(() => {
    const wrap = wrapRef.current
    const logo = logoRef.current
    if (!wrap || !logo) return
    const w = logo.offsetWidth
    const h = logo.offsetHeight
    if (w > 0 && h > 0) size.current = { w, h }
    pos.current.x = Math.min(pos.current.x, Math.max(0, wrap.clientWidth - size.current.w))
    pos.current.y = Math.min(pos.current.y, Math.max(0, wrap.clientHeight - size.current.h))
    logo.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
  }, [])

  const bumpColor = useCallback(() => {
    colorIndex.current = (colorIndex.current + 1) % COLORS.length
    setColor(COLORS[colorIndex.current])
  }, [])

  useEffect(() => {
    const wrap = wrapRef.current
    const logo = logoRef.current
    if (!wrap || !logo) return

    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow
    const prevBodyBg = body.style.background
    html.style.overflow = "hidden"
    body.style.overflow = "hidden"
    body.style.background = "#0000c8"

    let raf = 0
    let last = performance.now()
    let running = false

    const tick = (now: number) => {
      if (!running) return
      const dt = Math.min(0.048, (now - last) / 1000)
      last = now

      const boundsW = wrap.clientWidth
      const boundsH = wrap.clientHeight
      const { w, h } = size.current

      let { x, y } = pos.current
      let { x: vx, y: vy } = vel.current
      x += vx * dt
      y += vy * dt

      let hit = false
      if (x <= 0) {
        x = 0
        vx = Math.abs(vx)
        hit = true
      } else if (x + w >= boundsW) {
        x = Math.max(0, boundsW - w)
        vx = -Math.abs(vx)
        hit = true
      }
      if (y <= 0) {
        y = 0
        vy = Math.abs(vy)
        hit = true
      } else if (y + h >= boundsH) {
        y = Math.max(0, boundsH - h)
        vy = -Math.abs(vy)
        hit = true
      }

      if (hit) bumpColor()

      pos.current = { x, y }
      vel.current = { x: vx, y: vy }
      logo.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      measure()
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      const lw = size.current.w
      const lh = size.current.h
      pos.current = {
        x: Math.random() * Math.max(1, w - lw),
        y: Math.random() * Math.max(1, h - lh),
      }
      vel.current = {
        x: SPEED * (Math.random() > 0.5 ? 1 : -1),
        y: SPEED * (Math.random() > 0.5 ? 1 : -1),
      }
      logo.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
      setReady(true)
      running = true
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }

    const img = logo.querySelector("img")
    if (img?.complete && img.naturalWidth > 0) start()
    else img?.addEventListener("load", start, { once: true })

    const onResize = () => measure()
    window.addEventListener("resize", onResize)
    window.visualViewport?.addEventListener("resize", onResize)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      window.visualViewport?.removeEventListener("resize", onResize)
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
      body.style.background = prevBodyBg
    }
  }, [bumpColor, measure])

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 overflow-hidden"
      style={{ background: "#0000c8" }}
    >
      <Link
        href="/"
        className="absolute top-4 left-4 z-10 text-white/35 text-sm hover:text-white/80"
      >
        ← home
      </Link>

      <div
        ref={logoRef}
        className="absolute top-0 left-0 flex flex-col items-center will-change-transform"
        style={{
          width: "clamp(150px, 34vw, 250px)",
          color,
          opacity: ready ? 1 : 0,
        }}
      >
        <div className="relative w-[78%]" style={{ isolation: "isolate" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/dvd-face.png"
            alt=""
            draggable={false}
            className="block w-full h-auto select-none pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: color,
              mixBlendMode: "color",
              maskImage: "url(/dvd-face.png)",
              maskSize: "100% 100%",
              WebkitMaskImage: "url(/dvd-face.png)",
              WebkitMaskSize: "100% 100%",
            }}
          />
        </div>
        <DvdMark />
      </div>
    </div>
  )
}
