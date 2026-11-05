"use client"

import HomeContent from "@/components/home-content"
import { useEffect, useRef, useState } from "react"

type Phase = "idle" | "building" | "live"
type Kind = "bar" | "square" | "round" | "type" | "image" | "reveal"

type Job = {
  id: string
  kind: Kind
  sel: string
  after: string[]
  text?: string
  src?: string
  radius?: number
  dur: number
  reveal: boolean
  status: "wait" | "busy" | "done"
  cells?: HTMLElement[]
}

type Worker = {
  x: number
  y: number
  sx: number
  sy: number
  color: string
  job: Job | null
  t0: number
  lastId: string | null
  travel: number
  homeX: number
  homeY: number
}

const COLORS = [
  "#F24E1E",
  "#0ACF83",
  "#1ABCFE",
  "#FFC700",
  "#A259FF",
  "#00C2C7",
  "#FF7262",
  "#7C4DFF",
  "#FF5C8A",
  "#2D7FF9",
]
const N = COLORS.length
const PROJECTS = [
  { id: "Slate", src: "/slate.png" },
  { id: "SnapChain", src: "/Logo_snapchain.png" },
  { id: "Solana-Deploy-SDK", src: "/1500x500.jpeg" },
  { id: "Neural-Canvas-Playground", src: "/neural.jpeg" },
]
const JOB_LOGOS = ["/demandbase.png", "./Logo - Curved.png", "./cyro_studios_logo.jpeg"]
const REACH = ["twitter/x", "github", "linkedin", "say hello"]

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}
function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n))
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
function typeDur(text: string) {
  const n = text.length
  if (n <= 24) return Math.max(0.32, n * 0.04)
  return Math.max(0.55, n * 0.014)
}

function makeJobs(): Job[] {
  const jobs: Job[] = []
  const add = (
    id: string,
    kind: Kind,
    sel: string,
    after: string[],
    extra: Partial<Omit<Job, "id" | "kind" | "sel" | "after" | "status">> = {}
  ) => {
    const reveal =
      extra.reveal ?? (kind === "type" || kind === "image" || kind === "reveal" || kind === "bar")
    jobs.push({
      id,
      kind,
      sel,
      after,
      text: extra.text,
      src: extra.src,
      radius: extra.radius,
      dur:
        extra.dur ??
        (kind === "type" && extra.text
          ? typeDur(extra.text)
          : kind === "bar"
            ? 0.38
            : kind === "square"
              ? 0.32
              : kind === "round"
                ? 0.24
                : kind === "image"
                  ? 0.5
                  : 0.18),
      reveal,
      status: "wait",
    })
  }

  add("nav-bar", "bar", '[data-build="nav"]', [])
  add("nav-projects", "type", '[data-build="nav-projects"]', [], { text: "projects" })
  add("nav-blogs", "type", '[data-build="nav-blogs"]', [], { text: "blogs" })
  add("nav-interests", "type", '[data-build="nav-interests"]', [], { text: "Interests" })
  add("theme-sq", "square", '[data-build="nav-theme"]', [], { reveal: false })
  add("theme-round", "round", '[data-build="nav-theme"]', ["theme-sq"], { radius: 8, reveal: false })
  add("theme-icon", "reveal", '[data-build="nav-theme"]', ["theme-round"])

  add("avatar-sq", "square", '[data-build="avatar"]', [], { reveal: false })
  add("avatar-round", "round", '[data-build="avatar"]', ["avatar-sq"], {
    radius: 999,
    reveal: false,
  })
  add("avatar-img", "image", '[data-build="avatar"]', ["avatar-round"], {
    src: "/me.jpg",
    radius: 999,
  })

  add("name-type", "type", '[data-build="name"]', [], { text: "Aditya Anjana" })
  add("role-type", "type", '[data-build="role"]', [], {
    text: "software engineer • developer",
  })
  add("bio-type", "type", '[data-build="bio"]', [], {
    text: ":) Hey, I'm Aditya !!! I love building things and helping people.",
  })

  add("tags-bar", "bar", '[data-build="tags"]', [])
  ;["Web Dev", "AI/ML", "Web3"].forEach((label, i) => {
    add(`tag-${i}-sq`, "square", `[data-build="tag-${i}"]`, [], { reveal: false })
    add(`tag-${i}-round`, "round", `[data-build="tag-${i}"]`, [`tag-${i}-sq`], {
      radius: 8,
      reveal: false,
    })
    add(`tag-${i}-type`, "type", `[data-build="tag-${i}"]`, [`tag-${i}-round`], { text: label })
  })

  add("gh-title", "type", '[data-build="github-title"]', [], {
    text: "Github Activity",
  })

  add("exp-title", "type", '[data-build="exp-title"]', [], { text: "Experience" })
  for (let i = 0; i < 3; i++) {
    add(`job-${i}-bar`, "bar", `[data-build="job-${i}"]`, [], { reveal: true })
    add(`job-${i}-sq`, "square", `[data-build="joblogo-${i}"]`, [], { reveal: false })
    add(`job-${i}-round`, "round", `[data-build="joblogo-${i}"]`, [`job-${i}-sq`], {
      radius: 999,
      reveal: false,
    })
    add(`job-${i}-img`, "image", `[data-build="joblogo-${i}"]`, [`job-${i}-round`], {
      src: JOB_LOGOS[i],
      radius: 999,
    })
    add(`job-${i}-copy`, "type", `[data-build="jobcopy-${i}"]`, [], {
      text: i === 0 ? "Demandbase  SDE" : i === 1 ? "Kurma  Co-founder" : "Cyro Labs",
    })
  }

  add("proj-title", "type", '[data-build="projects-title"]', [], { text: "Projects." })
  PROJECTS.forEach((p) => {
    add(`p-${p.id}-sq`, "square", `[data-build="p-${p.id}"]`, [], { reveal: false, dur: 0.32 })
    add(`p-${p.id}-round`, "round", `[data-build="p-${p.id}"]`, [`p-${p.id}-sq`], {
      radius: 14,
      reveal: false,
    })
    add(`p-${p.id}-ibox`, "square", `[data-build="pimg-${p.id}"]`, [`p-${p.id}-round`], {
      reveal: false,
    })
    add(`p-${p.id}-img`, "image", `[data-build="pimg-${p.id}"]`, [`p-${p.id}-ibox`], { src: p.src })
    add(`p-${p.id}-body`, "type", `[data-build="pbody-${p.id}"]`, [`p-${p.id}-round`], {
      text: p.id.replace(/-/g, " "),
    })
  })

  add("music-title", "type", '[data-build="music-title"]', [], { text: "Listening to" })

  add("contact-title", "type", '[data-build="contact-title"]', [], { text: "Contact" })
  REACH.forEach((label, i) => {
    add(`reach-${i}-sq`, "square", `[data-build="reach-${i}"]`, [], { reveal: false })
    add(`reach-${i}-round`, "round", `[data-build="reach-${i}"]`, [`reach-${i}-sq`], {
      radius: 999,
      reveal: false,
    })
    add(`reach-${i}-type`, "type", `[data-build="reach-${i}"]`, [`reach-${i}-round`], { text: label })
  })
  add("footer-type", "type", '[data-build="footer"]', [], {
    text: `© ${new Date().getFullYear()} Aditya Anjana`,
  })

  return jobs
}

function Cursor({ color }: { color: string }) {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" fill="none" aria-hidden className="drop-shadow-md">
      <path
        d="M1.2 1.2 1.2 16.8 5.7 13.1 8.9 20.8 12.4 19.3 9.1 11.5 15.6 11.5Z"
        fill={color}
        stroke="#fff"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ExpPage() {
  const [phase, setPhase] = useState<Phase>("idle")
  const artboardRef = useRef<HTMLDivElement>(null)
  const ghostLayerRef = useRef<HTMLDivElement>(null)
  const cursorRefs = useRef<(HTMLDivElement | null)[]>([])
  const caretRefs = useRef<(HTMLDivElement | null)[]>([])
  const carryRefs = useRef<(HTMLImageElement | null)[]>([])

  const startBuild = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("live")
      return
    }
    setPhase("building")
  }

  const replay = () => {
    artboardRef.current?.querySelectorAll("[data-build]").forEach((el) => {
      el.classList.remove("is-framed", "is-built")
      ;(el as HTMLElement).style.removeProperty("--agent-color")
    })
    setPhase("idle")
  }

  useEffect(() => {
    if (phase !== "building") return
    const art = artboardRef.current
    const layer = ghostLayerRef.current
    if (!art || !layer) return

    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = "hidden"
    window.scrollTo(0, 0)

    art.querySelectorAll("[data-build]").forEach((el) => {
      el.classList.add("is-framed")
    })
    void art.offsetHeight

    const jobs = makeJobs()
    const done = new Set<string>()
    const park = (i: number, vw: number, vh: number) => ({
      x: 40 + i * ((vw - 80) / Math.max(1, N - 1)),
      y: vh - 42,
    })
    const workers: Worker[] = COLORS.map((color, i) => {
      const vw = window.innerWidth
      const x = 36 + i * ((vw - 72) / Math.max(1, N - 1))
      const home = park(i, vw, window.innerHeight)
      return {
        x,
        y: 20,
        sx: x,
        sy: 20,
        color,
        job: null,
        t0: 0,
        lastId: null,
        travel: 0,
        homeX: home.x,
        homeY: home.y,
      }
    })

    ;["/me.jpg", ...JOB_LOGOS, ...PROJECTS.map((p) => p.src)].forEach((src) => {
      const im = new window.Image()
      im.src = src
    })

    const ghosts = new Map<string, HTMLDivElement>()
    let raf = 0
    let interval = 0
    let running = true
    let lastTick = 0
    let scrollY = 0
    let lastVw = 0
    let lastVh = 0

    const elCache = new Map<string, HTMLElement | null>()
    const $ = (sel: string) => {
      const hit = elCache.get(sel)
      if (hit !== undefined && (!hit || hit.isConnected)) return hit
      const el = art.querySelector(sel) as HTMLElement | null
      elCache.set(sel, el)
      return el
    }

    const frameEl = (el: HTMLElement) => {
      el.classList.add("is-framed")
      let node: HTMLElement | null = el.parentElement
      while (node && art.contains(node)) {
        if (node.hasAttribute("data-build")) node.classList.add("is-framed")
        node = node.parentElement
      }
    }

    const clipOf = (job: Job, rect: DOMRect, el: HTMLElement | null) => {
      const rad = job.radius ?? 0
      if (rad >= 100) return "999px"
      if (rad > 0) return `${rad}px`
      if (el) {
        const br = getComputedStyle(el).borderRadius
        if (br && br !== "0px") return br
      }
      if (Math.abs(rect.width - rect.height) < 4) return "999px"
      return "0px"
    }

    const jobPoint = (job: Job, rect: DOMRect, vw: number) => {
      if (job.kind === "bar" || job.kind === "square") return { x: rect.left, y: rect.top }
      if (job.kind === "round") return { x: rect.left + rect.width, y: rect.top + 8 }
      if (job.kind === "type") return { x: rect.left + 8, y: rect.top + Math.min(20, rect.height * 0.45) }
      if (job.kind === "image")
        return {
          x: clamp(rect.left + rect.width / 2, 40, vw - 40),
          y: Math.max(8, rect.top - 24),
        }
      return { x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.5 }
    }

    const ghostFor = (sel: string, color: string) => {
      let g = ghosts.get(sel)
      if (!g) {
        g = document.createElement("div")
        g.className = "exp-ghost"
        g.innerHTML = "<img alt=''/><span></span>"
        g.style.borderColor = color
        layer.appendChild(g)
        ghosts.set(sel, g)
      }
      return g
    }

    const placeGhost = (
      g: HTMLDivElement,
      rect: DOMRect,
      e: number,
      kind: Kind,
      radius: number,
      color: string
    ) => {
      let width = Math.max(rect.width, 2)
      let height = Math.max(rect.height, 2)
      let r = 0
      if (kind === "bar") {
        width = Math.max(8, rect.width * e)
        height = Math.min(rect.height || 4, 24)
      } else if (kind === "square") {
        width = Math.max(2, rect.width * e)
        height = Math.max(2, rect.height * e)
      } else if (kind === "image") {
        r = radius >= 100 ? Math.min(width, height) * 0.5 : radius
      } else if (kind === "round") {
        r = radius >= 100 ? Math.min(rect.width, rect.height) * 0.5 * e : radius * e
      } else if (radius >= 100) {
        r = Math.min(rect.width, rect.height) * 0.5
      } else if (radius > 0) {
        r = radius
      }
      g.style.opacity = "1"
      g.style.borderColor = color
      g.style.width = `${width}px`
      g.style.height = `${height}px`
      g.style.borderRadius = `${r}px`
      g.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`
      g.style.background = "color-mix(in srgb, var(--background) 72%, transparent)"
      return { width, height, r }
    }

    const known = new Set(jobs.map((j) => j.id))
    const pushJob = (
      id: string,
      kind: Kind,
      sel: string,
      after: string[] = [],
      extra: Partial<Pick<Job, "text" | "src" | "radius" | "dur" | "reveal" | "cells">> = {}
    ) => {
      if (known.has(id)) return
      known.add(id)
      const reveal =
        extra.reveal ?? (kind === "type" || kind === "image" || kind === "reveal" || kind === "bar")
      jobs.push({
        id,
        kind,
        sel,
        after,
        text: extra.text,
        src: extra.src,
        radius: extra.radius,
        cells: extra.cells,
        dur:
          extra.dur ??
          (kind === "type" && extra.text
            ? typeDur(extra.text)
            : kind === "bar"
              ? 0.38
              : kind === "square"
                ? 0.32
                : kind === "round"
                  ? 0.24
                  : kind === "image"
                    ? 0.5
                    : 0.18),
        reveal,
        status: "wait",
      })
    }

    const labelOf = (el: Element) =>
      (el.textContent || "").replace(/\s+/g, " ").trim()

    let ghSynced = false
    let nowSynced = false
    const ensureDomJobs = () => {
      if (!ghSynced) {
        const nodes = art.querySelectorAll("[data-build^='gh-c-']")
        if (nodes.length) {
          ghSynced = true
          const byWeek = new Map<number, HTMLElement[]>()
          nodes.forEach((node) => {
            const el = node as HTMLElement
            el.classList.add("is-framed")
            const id = el.getAttribute("data-build") || ""
            const week = Number(id.split("-")[2])
            if (!Number.isFinite(week)) return
            const list = byWeek.get(week) ?? []
            list.push(el)
            list.sort((a, b) => {
              const da = Number((a.getAttribute("data-build") || "").split("-")[3] || 0)
              const db = Number((b.getAttribute("data-build") || "").split("-")[3] || 0)
              return da - db
            })
            byWeek.set(week, list)
          })
          ;[...byWeek.entries()]
            .sort((a, b) => a[0] - b[0])
            .forEach(([week, cells]) => {
              const first = cells[0].getAttribute("data-build")
              if (!first) return
              pushJob(`gh-w-${week}`, "square", `[data-build="${first}"]`, [], {
                reveal: true,
                dur: Math.max(0.12, cells.length * 0.028),
                radius: 2,
                cells,
              })
            })
        }
      }
      if (ghSynced) {
        ;["gh-user", "gh-total", "gh-less", "gh-more"].forEach((id) => {
          const el = $(`[data-build="${id}"]`)
          if (!el) return
          el.classList.add("is-framed")
          const text = labelOf(el)
          if (!text) return
          pushJob(id, "type", `[data-build="${id}"]`, [], { text })
        })
        for (let i = 0; i < 5; i++) {
          const id = `gh-leg-${i}`
          const el = $(`[data-build="${id}"]`)
          if (!el) continue
          el.classList.add("is-framed")
          pushJob(id, "square", `[data-build="${id}"]`, [], { reveal: true, dur: 0.08, radius: 2 })
        }
      }

      if (nowSynced && !known.has("now-card") && $('[data-build="now-card"]')) nowSynced = false
      if (nowSynced) return
      const idle = $('[data-build="now-idle"]')
      const artEl = $('[data-build="now-art"]')
      if (!idle && !artEl) return
      nowSynced = true
      if (idle) {
        idle.classList.add("is-framed")
        pushJob("now-idle", "type", '[data-build="now-idle"]', [], {
          text: labelOf(idle) || "Not playing",
        })
      }
      if (artEl) {
        artEl.classList.add("is-framed")
        pushJob("now-art-sq", "square", '[data-build="now-art"]', [], { reveal: false, dur: 0.28 })
        pushJob("now-art-round", "round", '[data-build="now-art"]', ["now-art-sq"], {
          radius: 10,
          reveal: false,
        })
        const src = artEl.getAttribute("data-src") || artEl.querySelector("img")?.currentSrc || ""
        if (src) {
          pushJob("now-art-img", "image", '[data-build="now-art"]', ["now-art-round"], {
            src,
            radius: 10,
          })
        } else {
          pushJob("now-art-show", "reveal", '[data-build="now-art"]', ["now-art-round"])
        }
      }
      ;[
        ["now-badge", "Now Playing"],
        ["now-title", ""],
        ["now-artist", ""],
        ["now-time", ""],
      ].forEach(([id, fallback]) => {
        const el = $(`[data-build="${id}"]`)
        if (!el) return
        el.classList.add("is-framed")
        pushJob(id, "type", `[data-build="${id}"]`, [], { text: labelOf(el) || fallback })
      })
      const bar = $('[data-build="now-progress"]')
      if (bar) {
        bar.classList.add("is-framed")
        pushJob("now-progress", "bar", '[data-build="now-progress"]', [], { reveal: true, dur: 0.35 })
      }
      const card = $('[data-build="now-card"]')
      if (card) {
        card.classList.add("is-framed")
        const after = ["now-art-img", "now-art-show", "now-badge", "now-title", "now-artist", "now-progress"].filter(
          (id) => known.has(id)
        )
        if (after.length) pushJob("now-card", "reveal", '[data-build="now-card"]', after, { dur: 0.2 })
      }
    }

    const readyJobs = () =>
      jobs.filter((j) => j.status === "wait" && j.after.every((id) => done.has(id)))

    const inViewport = (job: Job, vh: number) => {
      const el = $(job.sel)
      if (!el) return false
      const r = el.getBoundingClientRect()
      return r.top < vh * 1.05 && r.bottom > 8
    }

    const docTopOf = (sel: string) => {
      const el = $(sel)
      if (!el) return Number.POSITIVE_INFINITY
      return el.getBoundingClientRect().top + scrollY
    }

    const workAbove = (y: number) =>
      jobs.some((j) => {
        if (j.status === "done") return false
        if (j.id.startsWith("gh-c-") || j.id.startsWith("gh-w-")) return false
        return docTopOf(j.sel) + 48 < y
      })

    const dist = (ax: number, ay: number, bx: number, by: number) =>
      Math.hypot(ax - bx, ay - by)

    const claim = (w: Worker, job: Job, now: number) => {
      w.job = job
      w.t0 = now
      w.sx = w.x
      w.sy = w.y
      job.status = "busy"
      const el = $(job.sel)
      if (el) {
        frameEl(el)
        el.style.setProperty("--agent-color", w.color)
        if (!job.cells) void el.offsetHeight
        const rect = el.getBoundingClientRect()
        const dest = jobPoint(job, rect, window.innerWidth)
        const tiny = rect.width < 22 && rect.height < 22
        w.travel =
          job.kind === "image"
            ? 0
            : tiny
              ? 0.04
              : clamp(dist(w.x, w.y, dest.x, dest.y) / 2400, 0.08, 0.22)
      } else {
        w.travel = job.kind === "image" ? 0 : 0.12
      }
    }

    const finish = (w: Worker, job: Job) => {
      job.status = "done"
      done.add(job.id)
      w.lastId = job.id
      const el = $(job.sel)
      if (el && job.reveal) {
        el.classList.add("is-framed", "is-built")
        const g = ghosts.get(job.sel)
        if (g) {
          g.style.opacity = "0"
          window.setTimeout(() => g.remove(), 280)
          ghosts.delete(job.sel)
        }
      }
      w.job = null
    }

    const assign = (now: number, vh: number) => {
      const ready = readyJobs()
      if (!ready.length) return
      const idle = workers.filter((w) => !w.job)
      if (!idle.length) return

      const taken = new Set<string>()
      const used = new Set<Worker>()

      for (const w of idle) {
        if (!w.lastId) continue
        const next = ready.find((j) => !taken.has(j.id) && j.after.includes(w.lastId!))
        if (!next) continue
        claim(w, next, now)
        taken.add(next.id)
        used.add(w)
      }

      const busySels = new Set(workers.filter((w) => w.job).map((w) => w.job!.sel))
      const ghTop = docTopOf('[data-build="github"]')
      const leftover = ready.filter((j) => {
        if (j.status !== "wait" || busySels.has(j.sel) || !inViewport(j, vh)) return false
        if (j.id.startsWith("gh-w-") && workAbove(ghTop)) return false
        return true
      })
      const free = idle.filter((w) => !used.has(w))
      if (!free.length || !leftover.length) return

      const located = leftover
        .map((j) => {
          const r = $(j.sel)?.getBoundingClientRect()
          return {
            j,
            x: r ? r.left + r.width / 2 : 0,
            y: r ? r.top + r.height / 2 : Infinity,
          }
        })
        .sort((a, b) => a.y - b.y || a.x - b.x)

      const front = located[0]?.y ?? 0
      const band = located.filter((it) => it.y <= front + Math.min(120, vh * 0.26))
      const picked = band.slice(0, free.length)
      for (const item of picked) {
        const open = idle.filter((w) => !used.has(w))
        if (!open.length) break
        open.sort((a, b) => dist(a.x, a.y, item.x, item.y) - dist(b.x, b.y, item.x, item.y))
        claim(open[0], item.j, now)
        used.add(open[0])
      }
    }

    const tick = (now: number) => {
      if (!running) return
      lastTick = now
      const vw = window.innerWidth
      const vh = window.innerHeight
      if (vw !== lastVw || vh !== lastVh) {
        lastVw = vw
        lastVh = vh
        workers.forEach((w, i) => {
          const home = park(i, vw, vh)
          w.homeX = home.x
          w.homeY = home.y
        })
      }

      ensureDomJobs()
      assign(now, vh)

      workers.forEach((w, i) => {
        const job = w.job
        const el = job ? $(job.sel) : null
        const rect = el?.getBoundingClientRect()
        const local = job ? (now - w.t0) / 1000 : 0
        const traveling = !!job && local < w.travel
        const workT = job ? Math.max(0, local - w.travel) : 0
        const p = job ? clamp(workT / job.dur, 0, 1) : 0
        const e = easeOutCubic(p)

        let tx = w.x
        let ty = w.y
        const caret = caretRefs.current[i]
        const carry = carryRefs.current[i]
        if (caret) caret.style.opacity = "0"
        if (carry && job?.kind !== "image") {
          carry.style.opacity = "0"
          if (carry.dataset.want) {
            carry.dataset.want = ""
            carry.dataset.ready = "0"
            carry.removeAttribute("src")
          }
        }

        if (job && !el) {
          job.status = "done"
          done.add(job.id)
          w.job = null
          tx = w.homeX
          ty = w.homeY
        } else if (job && rect && traveling) {
          const dest = jobPoint(job, rect, vw)
          const q = easeOutCubic(clamp(local / Math.max(w.travel, 0.01), 0, 1))
          tx = lerp(w.sx, dest.x, q)
          ty = lerp(w.sy, dest.y, q)
        } else if (job?.cells && job.cells.length) {
          const cells = job.cells
          const n = Math.max(1, Math.min(cells.length, Math.ceil(e * cells.length)))
          for (let k = 0; k < n; k++) cells[k].classList.add("is-framed", "is-built")
          const cur = cells[n - 1]
          const r = cur.getBoundingClientRect()
          tx = r.left + r.width * 0.7
          ty = r.top + r.height * 0.7
          const g = ghostFor(`${job.id}-sweep`, w.color)
          placeGhost(g, r, 1, "square", 2, w.color)
          if (p >= 1) {
            for (let k = 0; k < cells.length; k++) cells[k].classList.add("is-framed", "is-built")
            const sweep = ghosts.get(`${job.id}-sweep`)
            if (sweep) {
              sweep.remove()
              ghosts.delete(`${job.id}-sweep`)
            }
            finish(w, job)
          }
        } else if (job && rect && (rect.width > 2 || job.kind === "square" || job.kind === "bar")) {
          const g = ghostFor(job.sel, w.color)
          const rad = job.radius ?? 0
          const box = placeGhost(g, rect, e, job.kind, rad, w.color)
          const span = g.querySelector("span") as HTMLSpanElement | null
          const img = g.querySelector("img") as HTMLImageElement | null
          if (img && job.kind !== "image") {
            img.style.opacity = "0"
            if (img.dataset.want) {
              img.dataset.want = ""
              img.removeAttribute("src")
            }
          }

          if (job.kind === "bar") {
            tx = rect.left + box.width
            ty = rect.top + box.height / 2
          } else if (job.kind === "square") {
            tx = rect.left + box.width
            ty = rect.top + box.height
          } else if (job.kind === "round") {
            tx = rect.left + rect.width
            ty = rect.top + 8
            g.style.borderRadius =
              rad >= 100 ? `${(Math.min(rect.width, rect.height) / 2) * e}px` : `${rad * e}px`
            g.style.width = `${rect.width}px`
            g.style.height = `${rect.height}px`
          } else if (job.kind === "type") {
            const full = job.text ?? ""
            const n = Math.max(0, Math.floor(e * full.length))
            if (span) span.textContent = full.slice(0, n)
            tx = rect.left + 8 + Math.min(rect.width - 10, n * 8)
            ty = rect.top + Math.min(20, rect.height * 0.45)
            if (caret) {
              caret.style.opacity = "1"
              caret.style.backgroundColor = w.color
              caret.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
            }
            const colW = Math.max(rect.width - 16, 40)
            const lines = Math.max(1, Math.ceil((Math.max(n, 1) * 8) / colW))
            const typeH = Math.min(rect.height || 22, lines * 22 + 6)
            g.style.width = `${rect.width}px`
            g.style.height = `${typeH}px`
          } else if (job.kind === "image") {
            const pickX = clamp(rect.left + rect.width / 2, 40, vw - 40)
            const pickY = Math.max(8, rect.top - 24)
            const dropX = rect.left + rect.width / 2
            const dropY = rect.top + rect.height / 2
            const radiusPx = clipOf(job, rect, el)
            g.style.borderRadius = radiusPx
            g.style.overflow = "hidden"
            if (img) {
              img.style.borderRadius = radiusPx
              img.style.objectFit = "cover"
            }
            const want = job.src || ""
            if (carry && want) {
              if (carry.dataset.want !== want) {
                carry.dataset.want = want
                carry.dataset.ready = "0"
                carry.style.opacity = "0"
                carry.onload = () => {
                  if (carry.dataset.want === want) carry.dataset.ready = "1"
                }
                carry.src = want
              }
              const size = Math.round(clamp(Math.min(rect.width, rect.height), 36, 72))
              carry.style.width = `${size}px`
              carry.style.height = `${size}px`
              carry.style.borderRadius = radiusPx
              carry.style.objectFit = "cover"
            }
            if (p < 0.3) {
              const q = easeOutCubic(p / 0.3)
              tx = lerp(w.sx, pickX, q)
              ty = lerp(w.sy, pickY, q)
              if (carry && carry.dataset.ready === "1") {
                carry.style.opacity = "0.95"
                const size = parseFloat(carry.style.width) || 48
                carry.style.transform = `translate3d(${tx - size / 2 + 10}px, ${ty - size / 2 + 10}px, 0)`
              }
            } else {
              const q = easeOutCubic((p - 0.3) / 0.7)
              tx = lerp(pickX, dropX, q)
              ty = lerp(pickY, dropY, q)
              if (carry && carry.dataset.ready === "1") {
                carry.style.opacity = String(0.95 * (1 - Math.max(0, (q - 0.8) / 0.2)))
                const size = parseFloat(carry.style.width) || 48
                carry.style.transform = `translate3d(${tx - size / 2 + 10}px, ${ty - size / 2 + 10}px, 0)`
              }
              if (img && want && q > 0.7) {
                if (img.dataset.want !== want) {
                  img.dataset.want = want
                  img.src = want
                }
                img.style.opacity = String((q - 0.7) / 0.3)
              }
            }
            g.style.width = `${rect.width}px`
            g.style.height = `${rect.height}px`
          } else if (job.kind === "reveal") {
            tx = rect.left + rect.width * 0.5
            ty = rect.top + rect.height * 0.5
            g.style.opacity = String(1 - e)
            g.style.width = `${rect.width}px`
            g.style.height = `${rect.height}px`
          }

          if (p >= 1) finish(w, job)
        } else if (!job) {
          const phase = now / 1000
          tx = w.homeX + Math.sin(phase * 1.1 + i * 1.7) * 10
          ty = w.homeY + Math.cos(phase * 0.9 + i * 1.1) * 6
        }

        tx = clamp(tx, 6, vw - 28)
        ty = clamp(ty, 6, vh - 28)
        const follow = traveling ? 0.55 : job?.kind === "image" ? 0.5 : job?.kind === "type" ? 0.42 : job ? 0.4 : 0.2
        w.x += (tx - w.x) * follow
        w.y += (ty - w.y) * follow
        const node = cursorRefs.current[i]
        if (node) {
          node.style.opacity = "1"
          node.style.transform = `translate3d(${w.x}px, ${w.y}px, 0)`
        }
      })

      const ghGrid = $('[data-build="github-grid"]') || $('[data-build="github"]')
      const ghBusy = workers.some((w) => w.job?.id.startsWith("gh-w-"))
      const ghClear = ghGrid ? !workAbove(docTopOf('[data-build="github"]')) : false

      if (ghBusy && ghClear && ghGrid) {
        const r = ghGrid.getBoundingClientRect()
        const docMid = r.top + scrollY + r.height / 2
        const target = Math.max(0, docMid - vh / 2)
        scrollY += (target - scrollY) * 0.06
        window.scrollTo(0, scrollY)
      } else {
        let highestUnfinished = Number.POSITIVE_INFINITY
        for (const j of jobs) {
          if (j.status === "done") continue
          if (j.id.startsWith("gh-w-") || j.id.startsWith("gh-c-") || j.cells) continue
          const el = $(j.sel)
          if (!el) continue
          const top = el.getBoundingClientRect().top + scrollY
          if (top < highestUnfinished) highestUnfinished = top
        }
        if (Number.isFinite(highestUnfinished)) {
          const target = Math.max(0, highestUnfinished - 64)
          scrollY += (target - scrollY) * 0.1
          window.scrollTo(0, scrollY)
        }
      }

      const allDone = jobs.every((j) => j.status === "done")
      if (allDone) {
        running = false
        window.clearInterval(interval)
        art.querySelectorAll("[data-build]").forEach((n) => n.classList.add("is-framed", "is-built"))
        workers.forEach((_, i) => {
          const node = cursorRefs.current[i]
          if (node) node.style.opacity = "0"
        })
        layer.replaceChildren()
        html.style.overflow = prevOverflow
        window.scrollTo({ top: 0, behavior: "smooth" })
        window.setTimeout(() => setPhase("live"), 280)
        return
      }

      raf = requestAnimationFrame(tick)
    }

    const boot = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        raf = requestAnimationFrame(tick)
      })
    )
    interval = window.setInterval(() => {
      if (!running) return
      const now = performance.now()
      if (now - lastTick < 40) return
      tick(now)
    }, 50)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      cancelAnimationFrame(boot)
      window.clearInterval(interval)
      layer.replaceChildren()
      html.style.overflow = prevOverflow
    }
  }, [phase])

  return (
    <div className="relative min-h-screen">
      {phase === "idle" && (
        <div className="min-h-dvh flex flex-col items-center justify-center px-6">
          <p className="text-sm tracking-wide text-neutral-500 dark:text-neutral-400 mb-6">
            10 subagents
          </p>
          <div className="flex flex-wrap justify-center gap-2.5 mb-12">
            {COLORS.map((color) => (
              <span
                key={color}
                className="inline-block size-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={startBuild}
            className="px-8 py-3 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-base font-medium hover:opacity-90 transition-opacity"
          >
            Build now
          </button>
        </div>
      )}

      {phase !== "idle" && (
        <div id="exp-stage" data-exp={phase} className="min-h-screen">
          <div ref={artboardRef}>
            <HomeContent showCat={phase === "live"} />
          </div>
        </div>
      )}

      {phase === "building" && (
        <>
          <div ref={ghostLayerRef} className="contents" />
          {COLORS.map((color, i) => (
            <div key={color}>
              <div
                ref={(n) => {
                  caretRefs.current[i] = n
                }}
                aria-hidden
                className="fixed top-0 left-0 z-50 pointer-events-none h-4 w-[2px]"
                style={{ opacity: 0 }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={(n) => {
                  carryRefs.current[i] = n
                }}
                alt=""
                className="fixed top-0 left-0 z-50 pointer-events-none h-16 w-16 object-cover shadow-lg"
                style={{ opacity: 0 }}
              />
              <div
                ref={(n) => {
                  cursorRefs.current[i] = n
                }}
                className="fixed top-0 left-0 z-50 pointer-events-none will-change-transform"
                style={{ transform: "translate3d(-80px,-80px,0)", transition: "opacity 0.35s ease" }}
              >
                <Cursor color={color} />
              </div>
            </div>
          ))}
        </>
      )}

      {phase === "live" && (
        <button
          type="button"
          onClick={replay}
          className="fixed bottom-5 right-5 z-40 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          replay
        </button>
      )}
    </div>
  )
}
