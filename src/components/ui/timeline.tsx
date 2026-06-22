"use client"

import { Slot } from "@radix-ui/react-slot"
import type * as React from "react"

import { cn } from "@/utilities/ui"

type DivProps = React.ComponentProps<"div"> & { asChild?: boolean }

function Primitive({
  asChild,
  className,
  slot,
  ...props
}: DivProps & { slot: string }) {
  const Comp = asChild ? Slot : "div"
  return <Comp className={className} data-slot={slot} {...props} />
}

export function Timeline({ activeIndex: _activeIndex, className, ...props }: DivProps & { activeIndex?: number }) {
  return <Primitive className={cn("relative flex flex-col", className)} slot="timeline" {...props} />
}

export function TimelineItem({ className, ...props }: DivProps) {
  return <Primitive className={cn("relative flex", className)} slot="timeline-item" {...props} />
}

export function TimelineDot({ className, ...props }: DivProps) {
  return <Primitive className={className} slot="timeline-dot" {...props} />
}

export function TimelineConnector({ className, ...props }: DivProps) {
  return <Primitive className={className} slot="timeline-connector" {...props} />
}

export function TimelineContent({ className, ...props }: DivProps) {
  return <Primitive className={className} slot="timeline-content" {...props} />
}

export function TimelineHeader({ className, ...props }: DivProps) {
  return <Primitive className={className} slot="timeline-header" {...props} />
}

export function TimelineDescription({ className, ...props }: DivProps) {
  return <Primitive className={className} slot="timeline-description" {...props} />
}

export function TimelineTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={className} data-slot="timeline-title" {...props} />
}

export function TimelineTime({ className, ...props }: React.ComponentProps<"time">) {
  return <time className={className} data-slot="timeline-time" {...props} />
}
