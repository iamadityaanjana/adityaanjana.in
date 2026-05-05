'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── types ────────────────────────────────────────────────────────────────────

interface Server {
  id: number
  name: string
  load: number
  requests: number
  maxLoad: number
  healthy: boolean
}

interface Request {
  id: number
  x: number
  y: number
  targetServer: number
  progress: number
  done: boolean
  color: string
}

type Algorithm = 'round-robin' | 'least-connections' | 'random' | 'weighted'

// ─── helpers ─────────────────────────────────────────────────────────────────

const REQUEST_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899']

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

// ─── sub-components ──────────────────────────────────────────────────────────

function LoadBar({ value, max }: { value: number; max: number }) {
  const pct = clamp((value / max) * 100, 0, 100)
  const color =
    pct < 50 ? 'bg-emerald-500' : pct < 80 ? 'bg-amber-400' : 'bg-rose-500'

  return (
    <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function ServerCard({ server }: { server: Server }) {
  const pct = clamp((server.load / server.maxLoad) * 100, 0, 100)
  const statusColor = !server.healthy
    ? 'bg-rose-500'
    : pct < 50
    ? 'bg-emerald-500'
    : pct < 80
    ? 'bg-amber-400'
    : 'bg-rose-500'

  return (
    <div
      className={`relative rounded-xl border p-4 transition-all duration-300 ${
        server.healthy
          ? 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'
          : 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 opacity-60'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {server.name}
        </span>
        <span className={`w-2.5 h-2.5 rounded-full ${statusColor} animate-pulse`} />
      </div>
      <LoadBar value={server.load} max={server.maxLoad} />
      <div className="mt-2 flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <span>{Math.round(pct)}% load</span>
        <span>{server.requests} req</span>
      </div>
    </div>
  )
}

// ─── interactive demo ─────────────────────────────────────────────────────────

function LoadBalancerDemo() {
  const [algorithm, setAlgorithm] = useState<Algorithm>('round-robin')
  const [running, setRunning] = useState(false)
  const [servers, setServers] = useState<Server[]>([
    { id: 0, name: 'Server A', load: 0, requests: 0, maxLoad: 100, healthy: true },
    { id: 1, name: 'Server B', load: 0, requests: 0, maxLoad: 100, healthy: true },
    { id: 2, name: 'Server C', load: 0, requests: 0, maxLoad: 80, healthy: true },
  ])
  const [requests, setRequests] = useState<Request[]>([])
  const rrIndex = useRef(0)
  const reqId = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const pickServer = useCallback(
    (srvs: Server[]): number => {
      const healthy = srvs.filter((s) => s.healthy)
      if (healthy.length === 0) return 0

      if (algorithm === 'round-robin') {
        const healthyIds = healthy.map((s) => s.id)
        const next = healthyIds[rrIndex.current % healthyIds.length]
        rrIndex.current++
        return next
      }
      if (algorithm === 'least-connections') {
        return healthy.reduce((a, b) => (a.load < b.load ? a : b)).id
      }
      if (algorithm === 'weighted') {
        // weight = inverse of maxLoad → smaller max gets fewer requests
        const weights = healthy.map((s) => s.maxLoad)
        const total = weights.reduce((a, b) => a + b, 0)
        let rand = Math.random() * total
        for (let i = 0; i < healthy.length; i++) {
          rand -= weights[i]
          if (rand <= 0) return healthy[i].id
        }
        return healthy[healthy.length - 1].id
      }
      // random
      return healthy[Math.floor(Math.random() * healthy.length)].id
    },
    [algorithm]
  )

  const spawnRequest = useCallback(() => {
    setServers((prev) => {
      const target = pickServer(prev)
      const color = REQUEST_COLORS[reqId.current % REQUEST_COLORS.length]
      const id = reqId.current++

      setRequests((r) => [
        ...r.slice(-30),
        { id, x: 0, y: 0, targetServer: target, progress: 0, done: false, color },
      ])

      return prev.map((s) =>
        s.id === target
          ? { ...s, load: Math.min(s.load + 8, s.maxLoad), requests: s.requests + 1 }
          : s
      )
    })

    // drain load slowly
    setTimeout(() => {
      setServers((prev) =>
        prev.map((s) => ({ ...s, load: Math.max(0, s.load - 5) }))
      )
    }, 1500)
  }, [pickServer])

  useEffect(() => {
    // animate request dots
    const raf = setInterval(() => {
      setRequests((prev) =>
        prev
          .map((r) => ({ ...r, progress: Math.min(r.progress + 0.04, 1) }))
          .filter((r) => r.progress < 1)
      )
    }, 30)
    return () => clearInterval(raf)
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(spawnRequest, 600)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, spawnRequest])

  const toggleServer = (id: number) => {
    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, healthy: !s.healthy } : s))
    )
  }

  const reset = () => {
    setRunning(false)
    setRequests([])
    rrIndex.current = 0
    reqId.current = 0
    setServers((prev) => prev.map((s) => ({ ...s, load: 0, requests: 0, healthy: true })))
  }

  const algos: { key: Algorithm; label: string }[] = [
    { key: 'round-robin', label: 'Round Robin' },
    { key: 'least-connections', label: 'Least Connections' },
    { key: 'weighted', label: 'Weighted' },
    { key: 'random', label: 'Random' },
  ]

  return (
    <div className="not-prose my-10 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
          Live Load Balancer
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              running
                ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-200'
                : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200'
            }`}
          >
            {running ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={spawnRequest}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
          >
            Send 1
          </button>
          <button
            onClick={reset}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Algorithm picker */}
      <div className="flex flex-wrap gap-2">
        {algos.map((a) => (
          <button
            key={a.key}
            onClick={() => { setAlgorithm(a.key); reset() }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              algorithm === a.key
                ? 'bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900'
                : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-600'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Visualiser */}
      <div className="relative flex items-center justify-between gap-4">
        {/* Load balancer node */}
        <div className="flex flex-col items-center shrink-0">
          <div className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
            running
              ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 shadow-sm shadow-indigo-200 dark:shadow-indigo-900'
              : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800'
          }`}>
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636 5.636 18.364" />
            </svg>
          </div>
          <span className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">Load Balancer</span>
          {/* animated request dots */}
          <div className="absolute inset-0 pointer-events-none">
            {requests.map((req) => {
              const p = req.progress
              // dots travel from LB (left) to server cards (right)
              const startX = 8 // percent
              const endX = 72 + req.targetServer * 9.5 // rough per-server spread
              const cx = startX + (endX - startX) * p
              const cy = 50 + Math.sin(p * Math.PI) * (req.targetServer === 1 ? 0 : req.targetServer === 0 ? -18 : 18)

              return (
                <div
                  key={req.id}
                  className="absolute w-2 h-2 rounded-full transition-none"
                  style={{
                    left: `${cx}%`,
                    top: `${cy}%`,
                    background: req.color,
                    transform: 'translate(-50%,-50%)',
                    opacity: 1 - p * 0.4,
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* Arrow line */}
        <div className="flex-1 border-t border-dashed border-neutral-300 dark:border-neutral-600" />

        {/* Servers */}
        <div className="grid grid-cols-1 gap-3 w-56 shrink-0">
          {servers.map((s) => (
            <div key={s.id} className="relative">
              <ServerCard server={s} />
              <button
                onClick={() => toggleServer(s.id)}
                title={s.healthy ? 'Click to simulate failure' : 'Click to recover'}
                className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                {s.healthy ? 'kill' : 'revive'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
        Click <strong>kill / revive</strong> on a server to simulate failures. Switch algorithms above.
      </p>
    </div>
  )
}

// ─── comparison table ─────────────────────────────────────────────────────────

function ComparisonTable() {
  const rows = [
    { algo: 'Round Robin', pros: 'Simple, fair distribution', cons: 'Ignores server load', best: 'Stateless, uniform requests' },
    { algo: 'Least Connections', pros: 'Adapts to actual load', cons: 'Slightly more overhead', best: 'Long-lived connections' },
    { algo: 'Weighted', pros: 'Respects server capacity', cons: 'Requires manual tuning', best: 'Heterogeneous servers' },
    { algo: 'Random', pros: 'Zero state, very fast', cons: 'Can be unbalanced', best: 'Large identical fleets' },
    { algo: 'IP Hash', pros: 'Session persistence', cons: 'Uneven if few IPs', best: 'Stateful sessions / caching' },
  ]

  return (
    <div className="not-prose my-8 overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-neutral-100 dark:bg-neutral-800 text-left">
            <th className="px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300">Algorithm</th>
            <th className="px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300">Pros</th>
            <th className="px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300">Cons</th>
            <th className="px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300">Best for</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.algo}
              className={`border-t border-neutral-200 dark:border-neutral-700 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/60 ${
                i % 2 === 0 ? '' : 'bg-neutral-50/50 dark:bg-neutral-800/20'
              }`}
            >
              <td className="px-4 py-3 font-medium text-neutral-800 dark:text-neutral-200 whitespace-nowrap">{r.algo}</td>
              <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{r.pros}</td>
              <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{r.cons}</td>
              <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{r.best}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── health check viz ─────────────────────────────────────────────────────────

function HealthCheckViz() {
  const [tick, setTick] = useState(0)
  const servers = ['API-1', 'API-2', 'API-3']
  const [statuses, setStatuses] = useState([true, true, true])

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1800)
    return () => clearInterval(t)
  }, [])

  const toggle = (i: number) =>
    setStatuses((prev) => prev.map((s, j) => (j === i ? !s : s)))

  return (
    <div className="not-prose my-8 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 p-6">
      <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
        Health Check Heartbeat — click a server to toggle its status
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        {servers.map((name, i) => (
          <button
            key={name}
            onClick={() => toggle(i)}
            className="flex flex-col items-center gap-2 focus:outline-none"
          >
            <div
              className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 select-none ${
                statuses[i]
                  ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  : 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400'
              }`}
              style={{
                boxShadow: statuses[i]
                  ? `0 0 0 ${((tick % 3 === i ? 8 : 0))}px rgba(16,185,129,0.15)`
                  : 'none',
                transform: tick % 3 === i && statuses[i] ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {name}
            </div>
            <span className={`text-xs font-medium ${statuses[i] ? 'text-emerald-500' : 'text-rose-500'}`}>
              {statuses[i] ? '● healthy' : '✕ down'}
            </span>
          </button>
        ))}
      </div>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center mt-4">
        Unhealthy servers are removed from rotation automatically.
      </p>
    </div>
  )
}

// ─── sticky ToC ───────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'what', label: 'What is it?' },
  { id: 'why', label: 'Why it matters' },
  { id: 'algorithms', label: 'Algorithms' },
  { id: 'demo', label: 'Live Demo' },
  { id: 'health', label: 'Health Checks' },
  { id: 'layers', label: 'L4 vs L7' },
  { id: 'realworld', label: 'Real World' },
  { id: 'tradeoffs', label: 'Trade-offs' },
]

function TableOfContents() {
  const [active, setActive] = useState('what')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="not-prose hidden lg:block sticky top-8 self-start w-44 shrink-0 space-y-1">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
        On this page
      </p>
      {SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={`block text-sm py-1 pl-3 border-l-2 transition-all duration-200 ${
            active === id
              ? 'border-neutral-800 dark:border-neutral-200 text-neutral-800 dark:text-neutral-200 font-medium'
              : 'border-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
          }`}
        >
          {label}
        </a>
      ))}
    </nav>
  )
}

// ─── prose section ────────────────────────────────────────────────────────────

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8 space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold text-neutral-800 dark:text-neutral-100">{title}</h2>
      {children}
    </section>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-base md:text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">{children}</p>
}

function Callout({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'tip' | 'warn' }) {
  const styles = {
    info: 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300',
    tip: 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300',
    warn: 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300',
  }
  const icons = { info: 'ℹ', tip: '✦', warn: '⚠' }
  return (
    <div className={`not-prose flex gap-3 rounded-xl border p-4 text-sm leading-relaxed ${styles[type]}`}>
      <span className="shrink-0 text-base">{icons[type]}</span>
      <div>{children}</div>
    </div>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="not-prose px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-sm font-mono">
      {children}
    </code>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="not-prose overflow-x-auto rounded-xl bg-neutral-900 dark:bg-neutral-800 text-neutral-100 text-sm p-5 leading-relaxed font-mono">
      {children.trim()}
    </pre>
  )
}

// ─── main export ──────────────────────────────────────────────────────────────

export default function LoadBalancingBlog() {
  return (
    <div className="flex gap-10">
      <TableOfContents />

      <div className="flex-1 min-w-0 space-y-12">

        {/* ── What is it ── */}
        <Section id="what" title="What is Load Balancing?">
          <P>
            At its core, a <strong>load balancer</strong> is a traffic cop for your infrastructure. When thousands
            of HTTP requests arrive every second, a single server can only do so much — it has finite CPU, memory,
            and network bandwidth. A load balancer sits in front of a pool of servers and distributes incoming
            requests across them, ensuring no single machine becomes a bottleneck.
          </P>
          <P>
            Think of it like a grocery store opening multiple checkout lanes. One cashier for 500 customers is a
            disaster. Ten cashiers, each handling a fair share, keeps the line moving.
          </P>
          <Callout type="info">
            Load balancing is not just about performance — it is the foundation of <strong>high availability</strong>.
            If one server crashes, the load balancer routes traffic to healthy ones, giving users a seamless experience.
          </Callout>
        </Section>

        {/* ── Why it matters ── */}
        <Section id="why" title="Why It Matters">
          <P>
            Modern applications serve millions of users. A single VM, no matter how powerful, has hard ceilings.
            Load balancing enables <strong>horizontal scaling</strong> — instead of buying a bigger server
            (vertical scaling), you add more smaller servers behind a load balancer.
          </P>

          <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            {[
              { icon: '⚡', label: 'Performance', desc: 'Requests spread across servers reduce individual latency.' },
              { icon: '🛡', label: 'Resilience', desc: 'Unhealthy servers are removed from rotation automatically.' },
              { icon: '📈', label: 'Scalability', desc: 'Add new servers behind the LB with zero downtime.' },
            ].map((c) => (
              <div key={c.label} className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-5 space-y-2">
                <span className="text-2xl">{c.icon}</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">{c.label}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{c.desc}</p>
              </div>
            ))}
          </div>

          <P>
            Companies like Netflix, Cloudflare, and Google handle billions of requests daily. Their reliability is
            inseparable from sophisticated load balancing at every layer of their stack.
          </P>
        </Section>

        {/* ── Algorithms ── */}
        <Section id="algorithms" title="Load Balancing Algorithms">
          <P>
            The algorithm determines <em>which</em> server a request goes to. There is no universally best
            choice — each fits different workloads.
          </P>

          <div className="not-prose space-y-4 my-6">
            {[
              {
                name: 'Round Robin',
                desc: 'Requests are distributed sequentially: Server A, Server B, Server C, then back to A. Simple and effective when all servers have identical specs and request costs.',
                badge: 'default',
              },
              {
                name: 'Weighted Round Robin',
                desc: 'Like Round Robin, but servers get a weight. A server with weight 3 gets 3x more requests than one with weight 1. Useful for heterogeneous fleets.',
                badge: 'weighted',
              },
              {
                name: 'Least Connections',
                desc: 'The server with the fewest active connections gets the next request. Adapts dynamically to load — perfect for long-lived connections like WebSockets.',
                badge: 'adaptive',
              },
              {
                name: 'IP Hash',
                desc: 'A hash of the client IP determines the server. The same client always hits the same server — session persistence without sticky cookies.',
                badge: 'stateful',
              },
              {
                name: 'Random',
                desc: 'A random healthy server is chosen. Surprisingly effective at scale — law of large numbers ensures even distribution with no coordination overhead.',
                badge: 'simple',
              },
              {
                name: 'Least Response Time',
                desc: 'Routes to the server with the lowest combination of active connections and response time. Needs active latency monitoring, but is the most intelligent.',
                badge: 'intelligent',
              },
            ].map((a) => (
              <div key={a.name} className="flex gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                <div className="shrink-0 w-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{a.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">{a.badge}</span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <ComparisonTable />
        </Section>

        {/* ── Live Demo ── */}
        <Section id="demo" title="Live Demo">
          <P>
            Switch between algorithms and watch how requests are routed in real time. Kill a server to
            see health-based failover in action.
          </P>
          <LoadBalancerDemo />
        </Section>

        {/* ── Health Checks ── */}
        <Section id="health" title="Health Checks">
          <P>
            A load balancer is only as good as its awareness of server health. Without health checks, it would
            happily route traffic to a crashed node, causing errors for users.
          </P>
          <HealthCheckViz />
          <P>
            Health checks come in two flavours:
          </P>
          <div className="not-prose space-y-3 my-4">
            {[
              { type: 'Passive', desc: 'Monitor real traffic. If a server returns too many 5xx errors, mark it unhealthy. Low overhead but reacts after users are already affected.' },
              { type: 'Active', desc: 'The load balancer periodically sends a synthetic probe (e.g. HTTP GET /health) to each server. Detects failure before real users are impacted.' },
            ].map((h) => (
              <div key={h.type} className="flex gap-3 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-900">
                <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-200 shrink-0 w-16">{h.type}</span>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{h.desc}</p>
              </div>
            ))}
          </div>
          <Callout type="tip">
            A good <Code>/health</Code> endpoint should verify the application is actually functional, not just that the
            process is running. Check DB connectivity, cache reachability, and any critical dependencies.
          </Callout>
          <P>
            Here is a minimal health endpoint in Node.js:
          </P>
          <CodeBlock>{`
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1')          // check DB
    await redis.ping()                  // check cache
    res.json({ status: 'ok' })
  } catch (err) {
    res.status(503).json({ status: 'degraded', error: err.message })
  }
})
          `}</CodeBlock>
        </Section>

        {/* ── L4 vs L7 ── */}
        <Section id="layers" title="L4 vs L7 Load Balancing">
          <P>
            Load balancers operate at different layers of the OSI model, each with different capabilities and
            tradeoffs.
          </P>
          <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-5 my-6">
            {[
              {
                layer: 'L4 — Transport',
                color: 'indigo',
                items: [
                  'Operates on TCP/UDP packets',
                  'Routing based on IP + port only',
                  'Cannot inspect HTTP headers or cookies',
                  'Extremely fast, minimal overhead',
                  'Example: AWS NLB, HAProxy TCP mode',
                ],
              },
              {
                layer: 'L7 — Application',
                color: 'emerald',
                items: [
                  'Operates on HTTP/HTTPS content',
                  'Can route by URL path, headers, cookies',
                  'Supports SSL termination',
                  'Enables A/B testing, canary deploys',
                  'Example: AWS ALB, Nginx, Envoy',
                ],
              },
            ].map((l) => (
              <div
                key={l.layer}
                className={`rounded-xl border p-5 space-y-3 ${
                  l.color === 'indigo'
                    ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20'
                    : 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                }`}
              >
                <p className={`font-semibold ${l.color === 'indigo' ? 'text-indigo-700 dark:text-indigo-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                  {l.layer}
                </p>
                <ul className="space-y-1.5">
                  {l.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Callout type="info">
            Most production systems use <strong>L7 load balancers</strong> for HTTP traffic because the
            content-awareness unlocks features like path-based routing (<Code>/api/*</Code> → API servers,
            <Code>/static/*</Code> → CDN), sticky sessions, and canary deployments.
          </Callout>
        </Section>

        {/* ── Real World ── */}
        <Section id="realworld" title="Real-World Architecture">
          <P>
            In a typical production deployment, load balancing happens at <em>multiple</em> layers simultaneously:
          </P>
          <div className="not-prose my-6 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 font-mono text-sm space-y-1 text-neutral-600 dark:text-neutral-400">
            {[
              { indent: 0, text: 'Internet', note: '' },
              { indent: 1, text: '↓', note: '' },
              { indent: 1, text: 'DNS (GeoDNS / Anycast)', note: '← routes to nearest region' },
              { indent: 1, text: '↓', note: '' },
              { indent: 1, text: 'L4 Load Balancer (NLB)', note: '← handles raw TCP, DDoS filtering' },
              { indent: 1, text: '↓', note: '' },
              { indent: 1, text: 'L7 Load Balancer (ALB / Nginx)', note: '← TLS termination, path routing' },
              { indent: 1, text: '↓', note: '' },
              { indent: 1, text: 'Application Servers  [1] [2] [3] [N]', note: '← your code' },
              { indent: 1, text: '↓', note: '' },
              { indent: 1, text: 'Internal LB (service mesh / Envoy)', note: '← microservice routing' },
              { indent: 1, text: '↓', note: '' },
              { indent: 1, text: 'Database read replicas  [R1] [R2]', note: '← read traffic spread' },
            ].map((row, i) => (
              <div key={i} className="flex gap-2" style={{ paddingLeft: row.indent * 16 }}>
                <span>{row.text}</span>
                {row.note && <span className="text-neutral-400 dark:text-neutral-500 text-xs self-center">{row.note}</span>}
              </div>
            ))}
          </div>
          <P>
            Kubernetes users get load balancing built-in via <Code>kube-proxy</Code> and <Code>Service</Code> objects,
            with advanced L7 capabilities through an <strong>Ingress Controller</strong> (Nginx Ingress, Traefik,
            or Istio).
          </P>
          <CodeBlock>{`
# Kubernetes Service — round-robin across pods automatically
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
          `}</CodeBlock>
        </Section>

        {/* ── Trade-offs ── */}
        <Section id="tradeoffs" title="Trade-offs & Gotchas">
          <P>
            Load balancers solve many problems but introduce a few of their own.
          </P>
          <div className="not-prose space-y-4 my-6">
            {[
              {
                title: 'Single Point of Failure',
                body: 'The load balancer itself must be highly available. Run it in an active-active or active-passive pair. Cloud providers (AWS ELB, GCP LB) handle this for you.',
                type: 'warn' as const,
              },
              {
                title: 'Session Stickiness',
                body: 'Stateful apps that store session data in-process break when requests hop between servers. Solutions: sticky sessions (IP hash / cookies), or better — move state to Redis / a DB.',
                type: 'warn' as const,
              },
              {
                title: 'SSL Termination Cost',
                body: 'Terminating TLS at the LB adds CPU overhead. Modern hardware handles this well, but be mindful at extreme scale. mTLS in service meshes adds another layer.',
                type: 'info' as const,
              },
              {
                title: 'Observability',
                body: 'Always expose per-server request rates, error rates, and latency from your load balancer. This data is critical for debugging incidents and capacity planning.',
                type: 'tip' as const,
              },
            ].map((t) => (
              <Callout key={t.title} type={t.type}>
                <strong>{t.title}:</strong> {t.body}
              </Callout>
            ))}
          </div>
          <P>
            Despite the gotchas, load balancing remains one of the most well-understood and reliable patterns in
            distributed systems. When in doubt, put a load balancer in front of it — your future self will thank you.
          </P>
        </Section>

      </div>
    </div>
  )
}
