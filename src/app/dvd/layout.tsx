import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "DVD • Aditya Anjana",
  description: "Bouncing DVD screensaver. Featuring Aditya.",
}

export default function DvdLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
