import type { HTMLAttributes } from 'react'

import { cn } from '@/utilities/ui'

type FairlendSectionTransitionProps = HTMLAttributes<HTMLDivElement> & {
  size?: 'comfortable' | 'spacious'
}

export function FairlendSectionTransition({
  className,
  size = 'comfortable',
  ...props
}: FairlendSectionTransitionProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative z-10 overflow-hidden bg-[linear-gradient(to_bottom,rgb(255_253_247)_0%,rgb(255_253_247/98%)_36%,rgb(255_253_247/92%)_68%,rgb(255_253_247/0%)_100%)]',
        'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-full before:bg-[radial-gradient(ellipse_82%_105%_at_50%_0%,rgb(232_241_240/24%)_0%,rgb(255_253_247/0%)_58%)]',
        'after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-2/3 after:bg-[linear-gradient(to_bottom,rgb(255_253_247/0%)_0%,rgb(255_253_247/58%)_70%,rgb(255_253_247/0%)_100%)]',
        size === 'comfortable' && 'h-[clamp(52px,6vw,92px)]',
        size === 'spacious' && 'h-[clamp(76px,8vw,132px)]',
        className,
      )}
      {...props}
    />
  )
}
