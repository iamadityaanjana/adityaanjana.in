import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Build • Aditya Anjana",
  description: "Watch 10 subagents assemble the portfolio live.",
}

export default function ExpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
