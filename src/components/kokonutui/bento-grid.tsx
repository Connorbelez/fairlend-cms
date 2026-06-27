"use client"

import type { ReactNode } from "react"

import { cn } from "@/utilities/ui"

interface BentoItem {
  className?: string
  description: string
  eyebrow?: string
  id: string
  title: string
}

export function KokonutBentoGridShell({
  children,
  className,
}: {
  animate?: boolean
  children: ReactNode
  className?: string
}) {
  return <div className={cn("grid gap-4", className)}>{children}</div>
}

export function KokonutBentoCard({
  children,
  item,
}: {
  children?: ReactNode
  item: BentoItem
}) {
  return (
    <article className={cn("relative overflow-hidden", item.className)}>
      <div className="bp-handoff-card-copy">
        {item.eyebrow ? <span>{item.eyebrow}</span> : null}
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
      {children}
    </article>
  )
}
