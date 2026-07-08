import type { CSSProperties } from 'react'
import { cva } from 'class-variance-authority'

export const fairlendRouteSelectorTokens = {
  colors: {
    sectionPaper: '#f7f6f1',
    paperOverlay: 'rgb(251 250 245 / 28%)',
    cardPaper: '#fbfaf5',
    cardPaperTranslucent: 'rgb(251 250 245 / 92%)',
    helperPaperTranslucent: 'rgb(251 250 245 / 90%)',
    whitePaper: '#fffdf9',
    ink: '#11110f',
    headingInk: '#070806',
    kickerInk: '#0d0e0c',
    bodyInk: '#181a16',
    cardCopyInk: '#242620',
    cardBulletInk: '#272923',
    helperTitleInk: '#141411',
    helperCopyInk: '#20221d',
    iconInk: '#090a07',
    buttonInk: '#0a0b08',
    badgeInk: '#0b0d07',
    arrowInk: '#050605',
    rule: '#deded8',
    ruleHover: '#c8c8be',
    buttonRule: '#d7d7d0',
    buttonRuleHover: '#bdbdb4',
    cardDivider: '#e6e4dc',
    helperRule: '#deded7',
    helperDivider: '#dfdfd7',
    stepLine: '#b8b8b0',
    stepArrow: '#85857d',
    lime: '#9cff00',
    limeHover: '#8df000',
    limeSoft: '#e8ff9b',
    limeGlow: 'rgb(185 255 0 / 55%)',
    limeCheckBorder: '#8acb11',
    limeCheck: '#7aaa0c',
  },
  radii: {
    section: '24px',
    card: '18px',
    helper: '14px',
    button: '8px',
    arrow: '7px',
    badge: '5px',
    pill: '9999px',
  },
  shadows: {
    routeCard: '0 18px 42px rgb(27 25 18 / 5%)',
    routeCardHover: '0 24px 52px rgb(27 25 18 / 8%)',
    routeCardSelected: '0 22px 48px rgb(138 255 0 / 14%), inset 0 0 0 1px rgb(156 255 0 / 24%)',
    helper: '0 16px 38px rgb(28 26 18 / 5%)',
    originDot: '0 0 20px rgb(156 255 0 / 60%)',
    iconOrb: '0 0 18px rgb(167 255 0 / 48%)',
  },
} as const

type FairlendRouteSelectorTokenProperty =
  | '--route-selector-bg'
  | '--fl-route-section-bg'
  | '--fl-route-paper-overlay'
  | '--fl-route-card-bg'
  | '--fl-route-card-bg-translucent'
  | '--fl-route-helper-bg'
  | '--fl-route-white-paper'
  | '--fl-route-ink'
  | '--fl-route-heading-ink'
  | '--fl-route-kicker-ink'
  | '--fl-route-body-ink'
  | '--fl-route-card-copy-ink'
  | '--fl-route-card-bullet-ink'
  | '--fl-route-helper-title-ink'
  | '--fl-route-helper-copy-ink'
  | '--fl-route-icon-ink'
  | '--fl-route-button-ink'
  | '--fl-route-badge-ink'
  | '--fl-route-arrow-ink'
  | '--fl-route-rule'
  | '--fl-route-rule-hover'
  | '--fl-route-button-rule'
  | '--fl-route-button-rule-hover'
  | '--fl-route-card-divider'
  | '--fl-route-helper-rule'
  | '--fl-route-helper-divider'
  | '--fl-route-step-line'
  | '--fl-route-step-arrow'
  | '--fl-route-lime'
  | '--fl-route-lime-hover'
  | '--fl-route-lime-soft'
  | '--fl-route-lime-glow'
  | '--fl-route-lime-check-border'
  | '--fl-route-lime-check'
  | '--fl-route-radius-section'
  | '--fl-route-radius-card'
  | '--fl-route-radius-helper'
  | '--fl-route-radius-button'
  | '--fl-route-radius-arrow'
  | '--fl-route-radius-badge'
  | '--fl-route-radius-pill'
  | '--fl-route-shadow-card'
  | '--fl-route-shadow-card-hover'
  | '--fl-route-shadow-card-selected'
  | '--fl-route-shadow-helper'
  | '--fl-route-shadow-origin-dot'
  | '--fl-route-shadow-icon-orb'

export type FairlendRouteSelectorStyle = CSSProperties &
  Partial<Record<FairlendRouteSelectorTokenProperty, string>>

export const fairlendRouteSelectorTokenStyles = {
  '--fl-route-section-bg': fairlendRouteSelectorTokens.colors.sectionPaper,
  '--fl-route-paper-overlay': fairlendRouteSelectorTokens.colors.paperOverlay,
  '--fl-route-card-bg': fairlendRouteSelectorTokens.colors.cardPaper,
  '--fl-route-card-bg-translucent': fairlendRouteSelectorTokens.colors.cardPaperTranslucent,
  '--fl-route-helper-bg': fairlendRouteSelectorTokens.colors.helperPaperTranslucent,
  '--fl-route-white-paper': fairlendRouteSelectorTokens.colors.whitePaper,
  '--fl-route-ink': fairlendRouteSelectorTokens.colors.ink,
  '--fl-route-heading-ink': fairlendRouteSelectorTokens.colors.headingInk,
  '--fl-route-kicker-ink': fairlendRouteSelectorTokens.colors.kickerInk,
  '--fl-route-body-ink': fairlendRouteSelectorTokens.colors.bodyInk,
  '--fl-route-card-copy-ink': fairlendRouteSelectorTokens.colors.cardCopyInk,
  '--fl-route-card-bullet-ink': fairlendRouteSelectorTokens.colors.cardBulletInk,
  '--fl-route-helper-title-ink': fairlendRouteSelectorTokens.colors.helperTitleInk,
  '--fl-route-helper-copy-ink': fairlendRouteSelectorTokens.colors.helperCopyInk,
  '--fl-route-icon-ink': fairlendRouteSelectorTokens.colors.iconInk,
  '--fl-route-button-ink': fairlendRouteSelectorTokens.colors.buttonInk,
  '--fl-route-badge-ink': fairlendRouteSelectorTokens.colors.badgeInk,
  '--fl-route-arrow-ink': fairlendRouteSelectorTokens.colors.arrowInk,
  '--fl-route-rule': fairlendRouteSelectorTokens.colors.rule,
  '--fl-route-rule-hover': fairlendRouteSelectorTokens.colors.ruleHover,
  '--fl-route-button-rule': fairlendRouteSelectorTokens.colors.buttonRule,
  '--fl-route-button-rule-hover': fairlendRouteSelectorTokens.colors.buttonRuleHover,
  '--fl-route-card-divider': fairlendRouteSelectorTokens.colors.cardDivider,
  '--fl-route-helper-rule': fairlendRouteSelectorTokens.colors.helperRule,
  '--fl-route-helper-divider': fairlendRouteSelectorTokens.colors.helperDivider,
  '--fl-route-step-line': fairlendRouteSelectorTokens.colors.stepLine,
  '--fl-route-step-arrow': fairlendRouteSelectorTokens.colors.stepArrow,
  '--fl-route-lime': fairlendRouteSelectorTokens.colors.lime,
  '--fl-route-lime-hover': fairlendRouteSelectorTokens.colors.limeHover,
  '--fl-route-lime-soft': fairlendRouteSelectorTokens.colors.limeSoft,
  '--fl-route-lime-glow': fairlendRouteSelectorTokens.colors.limeGlow,
  '--fl-route-lime-check-border': fairlendRouteSelectorTokens.colors.limeCheckBorder,
  '--fl-route-lime-check': fairlendRouteSelectorTokens.colors.limeCheck,
  '--fl-route-radius-section': fairlendRouteSelectorTokens.radii.section,
  '--fl-route-radius-card': fairlendRouteSelectorTokens.radii.card,
  '--fl-route-radius-helper': fairlendRouteSelectorTokens.radii.helper,
  '--fl-route-radius-button': fairlendRouteSelectorTokens.radii.button,
  '--fl-route-radius-arrow': fairlendRouteSelectorTokens.radii.arrow,
  '--fl-route-radius-badge': fairlendRouteSelectorTokens.radii.badge,
  '--fl-route-radius-pill': fairlendRouteSelectorTokens.radii.pill,
  '--fl-route-shadow-card': fairlendRouteSelectorTokens.shadows.routeCard,
  '--fl-route-shadow-card-hover': fairlendRouteSelectorTokens.shadows.routeCardHover,
  '--fl-route-shadow-card-selected': fairlendRouteSelectorTokens.shadows.routeCardSelected,
  '--fl-route-shadow-helper': fairlendRouteSelectorTokens.shadows.helper,
  '--fl-route-shadow-origin-dot': fairlendRouteSelectorTokens.shadows.originDot,
  '--fl-route-shadow-icon-orb': fairlendRouteSelectorTokens.shadows.iconOrb,
} satisfies FairlendRouteSelectorStyle

export const fairlendRouteSelectorVariants = cva(
  'relative isolate overflow-hidden rounded-[var(--fl-route-radius-section)] bg-[color:var(--fl-route-section-bg)] px-6 py-[68px] text-[color:var(--fl-route-ink)] [--route-motion-ease:cubic-bezier(0.16,1,0.3,1)] sm:px-8 lg:px-10 lg:py-[70px]',
)

export const fairlendRouteSelectorLayerVariants = cva(
  'pointer-events-none absolute inset-0 -z-10',
  {
    variants: {
      layer: {
        map: 'bg-[image:var(--route-selector-bg)] bg-cover bg-center opacity-95',
        paper: 'bg-[color:var(--fl-route-paper-overlay)]',
      },
    },
  },
)

export const fairlendRouteHeaderTextVariants = cva('text-center', {
  variants: {
    role: {
      kicker:
        'm-0 text-[12px] leading-none font-black tracking-[0.28em] text-[color:var(--fl-route-kicker-ink)] uppercase',
      title:
        'mt-4 max-w-[720px] font-serif text-[52px] leading-[0.89] font-semibold tracking-normal text-[color:var(--fl-route-heading-ink)] sm:text-[60px] lg:text-[72px]',
      description:
        'mt-6 max-w-[560px] text-[16px] leading-[1.45] font-medium text-[color:var(--fl-route-body-ink)]',
    },
  },
})

export const fairlendRouteOriginDotVariants = cva(
  'mb-3 size-[9px] rounded-[var(--fl-route-radius-pill)] bg-[color:var(--fl-route-lime)] shadow-[var(--fl-route-shadow-origin-dot)]',
)

export const fairlendRouteCardVariants = cva(
  'group relative flex min-h-[520px] flex-col overflow-hidden rounded-[var(--fl-route-radius-card)] border bg-[color:var(--fl-route-card-bg-translucent)] p-[18px] shadow-[var(--fl-route-shadow-card)] backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-300 ease-[var(--route-motion-ease)]',
  {
    variants: {
      selected: {
        true: 'border-[color:var(--fl-route-lime)] shadow-[var(--fl-route-shadow-card-selected)]',
        false:
          'border-[color:var(--fl-route-rule)] motion-safe:hover:-translate-y-1 hover:border-[color:var(--fl-route-rule-hover)] hover:shadow-[var(--fl-route-shadow-card-hover)]',
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
)

export const fairlendRouteCardButtonVariants = cva(
  'h-11 w-full justify-between rounded-[var(--fl-route-radius-button)] px-3.5 text-[14px] leading-none font-semibold tracking-normal shadow-none transition-[background-color,border-color,transform] duration-200 ease-[var(--route-motion-ease)] active:scale-[0.985] focus-visible:ring-[3px] focus-visible:ring-[color:var(--fl-route-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--fl-route-card-bg)] focus-visible:outline-[color:var(--fl-route-ink)]',
  {
    variants: {
      selected: {
        true: 'border border-[color:var(--fl-route-lime)] bg-[color:var(--fl-route-lime)] text-[color:var(--fl-route-button-ink)] hover:bg-[color:var(--fl-route-lime-hover)]',
        false:
          'border border-[color:var(--fl-route-button-rule)] bg-[color:var(--fl-route-card-bg)] text-[color:var(--fl-route-ink)] hover:border-[color:var(--fl-route-button-rule-hover)] hover:bg-[color:var(--fl-route-white-paper)]',
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
)

export const fairlendRouteCardTextVariants = cva('', {
  variants: {
    role: {
      title:
        'max-w-[150px] text-balance font-serif text-[27px] leading-[0.94] font-semibold tracking-normal text-[color:var(--fl-route-ink)]',
      description:
        'mt-5 min-h-[52px] text-pretty text-[13px] leading-[1.32] font-semibold text-[color:var(--fl-route-card-copy-ink)]',
      bullet:
        'flex items-start gap-2 text-[11px] leading-[1.28] font-semibold text-[color:var(--fl-route-card-bullet-ink)]',
    },
  },
})

export const fairlendRouteBadgeVariants = cva(
  'absolute top-[11px] right-[11px] z-20 rounded-[var(--fl-route-radius-badge)] border-0 bg-[color:var(--fl-route-lime)] px-2 py-1 text-[9px] leading-none font-black tracking-[0.04em] text-[color:var(--fl-route-badge-ink)] uppercase shadow-none',
)

export const fairlendRouteBenefitIconVariants = cva(
  'mt-px flex size-[12px] shrink-0 items-center justify-center rounded-[var(--fl-route-radius-pill)] border border-[color:var(--fl-route-lime-check-border)] text-[color:var(--fl-route-lime-check)]',
)

export const fairlendRouteCardFooterVariants = cva(
  'mt-4 border-t border-[color:var(--fl-route-card-divider)] pt-3',
)

export const fairlendRouteArrowBoxVariants = cva(
  'flex items-center justify-center rounded-[var(--fl-route-radius-arrow)] bg-[color:var(--fl-route-arrow-ink)] text-[color:var(--fl-route-lime)]',
  {
    variants: {
      size: {
        card: 'size-[29px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
        helper: 'size-[28px]',
      },
    },
    defaultVariants: {
      size: 'card',
    },
  },
)

export const fairlendRouteHelpBannerVariants = cva(
  'grid w-full max-w-[750px] grid-cols-[96px_minmax(0,1fr)_1px_196px] items-center gap-7 rounded-[var(--fl-route-radius-helper)] border border-[color:var(--fl-route-helper-rule)] bg-[color:var(--fl-route-helper-bg)] px-5 py-3 shadow-[var(--fl-route-shadow-helper)] backdrop-blur-sm max-md:grid-cols-[74px_minmax(0,1fr)] max-md:gap-x-4 max-md:gap-y-3 max-md:px-4 max-md:py-4',
)

export const fairlendRouteHelpTextVariants = cva('', {
  variants: {
    role: {
      title:
        'font-serif text-[22px] leading-none font-semibold tracking-normal text-[color:var(--fl-route-helper-title-ink)] max-md:text-[20px]',
      body: 'mt-2 text-pretty text-[12px] leading-[1.16] font-semibold text-[color:var(--fl-route-helper-copy-ink)] max-md:leading-[1.25]',
    },
  },
})

export const fairlendRouteHelpDividerVariants = cva(
  'h-[52px] bg-[color:var(--fl-route-helper-divider)] max-md:hidden',
)

export const fairlendRouteHelpButtonVariants = cva(
  'h-10 justify-between rounded-[var(--fl-route-radius-button)] border border-[color:var(--fl-route-lime)] bg-[color:var(--fl-route-lime)] px-3 text-[13px] leading-none font-semibold text-[color:var(--fl-route-button-ink)] shadow-none transition-[background-color,transform] duration-200 ease-[var(--route-motion-ease)] hover:bg-[color:var(--fl-route-lime-hover)] active:scale-[0.985] focus-visible:ring-[3px] focus-visible:ring-[color:var(--fl-route-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--fl-route-card-bg)] focus-visible:outline-[color:var(--fl-route-ink)] max-md:col-span-2 max-md:ml-0 max-md:w-full',
)

export const fairlendRouteStepTrackVariants = cva(
  'relative w-full text-[color:var(--fl-route-ink)]',
  {
    variants: {
      density: {
        card: 'pt-1',
        compact: 'pt-0.5',
      },
    },
    defaultVariants: {
      density: 'card',
    },
  },
)

export const fairlendRouteStepLineVariants = cva(
  'absolute top-[7px] right-[11px] left-[11px] h-px bg-[color:var(--fl-route-step-line)]',
)

export const fairlendRouteStepDotVariants = cva(
  'size-[9px] rounded-[var(--fl-route-radius-pill)] ring-[3px] ring-[color:var(--fl-route-card-bg)]',
  {
    variants: {
      active: {
        true: 'bg-[color:var(--fl-route-lime)]',
        false: 'bg-[color:var(--fl-route-ink)]',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
)

export const fairlendRouteStepLabelVariants = cva(
  'relative max-w-full text-center text-[11px] leading-none font-semibold whitespace-nowrap',
)

export const fairlendRouteStepArrowVariants = cva(
  'absolute top-1/2 -right-[17px] -translate-y-1/2 text-[13px] leading-none font-medium text-[color:var(--fl-route-step-arrow)]',
)

export const fairlendRouteIconBadgeVariants = cva(
  'relative isolate flex shrink-0 items-center justify-center rounded-[var(--fl-route-radius-pill)] text-[color:var(--fl-route-icon-ink)]',
  {
    variants: {
      size: {
        card: 'size-11',
        compact: 'size-9',
      },
    },
    defaultVariants: {
      size: 'card',
    },
  },
)

export const fairlendRouteIconBadgeSurfaceVariants = cva(
  'absolute -z-10 rounded-[var(--fl-route-radius-pill)]',
  {
    variants: {
      layer: {
        base: 'inset-0 bg-[color:var(--fl-route-lime-soft)] shadow-[var(--fl-route-shadow-icon-orb)]',
        glow: 'inset-2 bg-[color:var(--fl-route-lime-glow)] blur-md',
      },
    },
  },
)
