import type { LucideIcon } from 'lucide-react'
import type { HTMLAttributes, ReactNode } from 'react'

export type FairlendRouteIcon = LucideIcon

export type FairlendRouteImage = {
  src: string
  alt: string
  width: number
  height: number
}

export type FairlendRouteService = {
  title: string
  description: string
  href: string
}

export type FairlendRouteHighlight = {
  label: string
  value: string
}

export type FairlendRouteChoice = {
  id: string
  title: string
  description: string
  bullets: string[]
  steps: string[]
  stepDescriptions?: string[]
  ctaLabel: string
  href: string
  icon: FairlendRouteIcon
  illustration: FairlendRouteImage
  badge?: string
  callout?: 'garden-suite-rental-income'
  density?: 'standard' | 'compact'
  disclaimer?: string
  highlights?: FairlendRouteHighlight[]
  services?: FairlendRouteService[]
  span?: 'standard' | 'wide'
}

export type FairlendRouteHelpBannerContent = {
  title: string
  body: string
  ctaLabel: string
  image: FairlendRouteImage
}

export type FairlendRouteSelectorCopy = {
  kicker: string
  title: ReactNode
  description: ReactNode
}

export type FairlendRouteComponentProps<TElement extends HTMLElement = HTMLElement> =
  HTMLAttributes<TElement>
