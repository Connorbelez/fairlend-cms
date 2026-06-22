import type * as React from "react"

import { cn } from "@/utilities/ui"

export function Frame({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("relative flex flex-col", className)} data-slot="frame" {...props} />
}
