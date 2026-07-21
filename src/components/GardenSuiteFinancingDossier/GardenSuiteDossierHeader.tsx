'use client'

import Link from 'next/link'
import { ChevronDown, Menu, Phone } from 'lucide-react'
import type { HTMLAttributes, ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { cn } from '@/utilities/ui'

export type GardenSuiteDossierNavChild = {
  description?: string
  href: string
  label: string
}

export type GardenSuiteDossierNavItem = {
  children?: readonly GardenSuiteDossierNavChild[]
  href: string
  label: string
}

export type GardenSuiteDossierHeaderAction = {
  href: string
  label: string
}

export interface GardenSuiteDossierHeaderProps extends HTMLAttributes<HTMLElement> {
  action?: GardenSuiteDossierHeaderAction
  brand?: ReactNode
  brandHref?: string
  brandLabel?: string
  mobileMenuLabel?: string
  navItems?: readonly GardenSuiteDossierNavItem[]
  navigationLabel?: string
  phoneDisplay?: string
  phoneHref?: string
}

const defaultNavItems: readonly GardenSuiteDossierNavItem[] = [
  {
    label: 'Solutions',
    href: '/solutions',
    children: [
      { label: 'Garden suite financing', href: '/garden-suite-financing' },
      { label: 'Construction financing', href: '/construction-financing' },
      { label: 'Bridge loans', href: '/bridge-loans' },
    ],
  },
  {
    label: 'Calculators',
    href: '/calculators',
    children: [
      { label: 'Mortgage calculator', href: '/calculators/mortgage-calculator' },
      { label: 'Land transfer tax', href: '/calculators/land-transfer-tax' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'Insights', href: '/posts' },
      { label: 'Guides', href: '/resources' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const defaultAction: GardenSuiteDossierHeaderAction = {
  href: '/apply',
  label: 'Apply now',
}

function DossierWordmark({ children }: { children?: ReactNode }) {
  return (
    <span className="inline-block origin-left scale-x-[0.78] font-[family-name:var(--font-oxanium)] text-[24px] leading-none font-black tracking-[-0.055em] uppercase">
      {children ?? 'FairLend'}
    </span>
  )
}

function DesktopNavItem({ item }: { item: GardenSuiteDossierNavItem }) {
  if (!item.children?.length) {
    return (
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            className="inline-flex h-10 items-center px-1.5 text-[9px] leading-none font-medium tracking-[-0.01em] uppercase outline-none transition-colors hover:text-[#416f12] focus-visible:ring-2 focus-visible:ring-[#77bd21]"
            href={item.href}
          >
            {item.label}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    )
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="h-10 rounded-none bg-transparent px-1.5 text-[9px] leading-none font-medium tracking-[-0.01em] uppercase hover:bg-transparent hover:text-[#416f12] focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-[#416f12]">
        {item.label}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[280px] gap-px bg-[#d8d8d1] p-px">
          <li>
            <NavigationMenuLink asChild>
              <Link
                className="block bg-[#f8f7f2] px-4 py-3 text-[10px] font-extrabold tracking-[0.04em] uppercase outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#77bd21]"
                href={item.href}
              >
                All {item.label}
              </Link>
            </NavigationMenuLink>
          </li>
          {item.children.map((child) => (
            <li key={`${item.label}-${child.href}`}>
              <NavigationMenuLink asChild>
                <Link
                  className="block bg-[#f8f7f2] px-4 py-3 outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#77bd21]"
                  href={child.href}
                >
                  <span className="block text-[10px] font-extrabold tracking-[0.04em] uppercase">
                    {child.label}
                  </span>
                  {child.description ? (
                    <span className="mt-1 block text-[11px] leading-4 text-black/60">
                      {child.description}
                    </span>
                  ) : null}
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

function MobileNav({
  items,
  menuLabel,
  navigationLabel,
}: {
  items: readonly GardenSuiteDossierNavItem[]
  menuLabel: string
  navigationLabel: string
}) {
  return (
    <details className="group relative min-[900px]:hidden!">
      <summary className="flex h-9 cursor-pointer list-none items-center gap-1.5 px-2 text-[10px] font-extrabold tracking-[0.05em] uppercase outline-none marker:hidden focus-visible:ring-2 focus-visible:ring-[#77bd21] [&::-webkit-details-marker]:hidden">
        <Menu aria-hidden="true" className="size-3.5" />
        {menuLabel}
        <ChevronDown
          aria-hidden="true"
          className="size-3 transition-transform motion-reduce:transition-none group-open:rotate-180"
        />
      </summary>
      <nav
        aria-label={navigationLabel}
        className="absolute top-[calc(100%+1px)] right-0 z-50 w-[min(19rem,calc(100vw-1rem))] border border-[#111] bg-[#f8f7f2] shadow-[5px_5px_0_rgb(0_0_0/18%)]"
      >
        <ul className="divide-y divide-black/15">
          {items.map((item) => (
            <li key={item.label}>
              <Link
                className="block px-4 py-3 text-[11px] font-extrabold tracking-[0.05em] uppercase outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#77bd21]"
                href={item.href}
              >
                {item.label}
              </Link>
              {item.children?.length ? (
                <ul className="border-t border-black/10 bg-black/[0.025] px-3 py-1">
                  {item.children.map((child) => (
                    <li key={`${item.label}-${child.href}`}>
                      <Link
                        className="block px-2 py-2 text-[10px] font-bold text-black/65 outline-none hover:text-black focus-visible:ring-2 focus-visible:ring-[#77bd21]"
                        href={child.href}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </details>
  )
}

export function GardenSuiteDossierHeader({
  action = defaultAction,
  brand,
  brandHref = '/',
  brandLabel = 'FairLend home',
  className,
  mobileMenuLabel = 'Menu',
  navItems = defaultNavItems,
  navigationLabel = 'Primary navigation',
  phoneDisplay = '416- fairlend',
  phoneHref = 'tel:+14163247536',
  ...props
}: GardenSuiteDossierHeaderProps) {
  return (
    <header
      className={cn(
        'relative z-40 h-10 border-b border-[#111] bg-[#f8f7f2] text-[#08090a]',
        className,
      )}
      {...props}
    >
      <div className="flex h-full w-full items-center gap-2 px-3 sm:px-3.5">
        <Link
          aria-label={brandLabel}
          className="mr-auto shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#77bd21] min-[900px]:mr-0! min-[900px]:w-[236px]!"
          href={brandHref}
        >
          <DossierWordmark>{brand}</DossierWordmark>
        </Link>

        <NavigationMenu aria-label={navigationLabel} className="hidden flex-none min-[900px]:flex!">
          <NavigationMenuList className="space-x-0">
            {navItems.map((item) => (
              <DesktopNavItem item={item} key={item.label} />
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <a
          className="ml-auto hidden h-10 items-center gap-1.5 px-2 text-[9px] font-medium tracking-[0.01em] outline-none hover:text-[#416f12] focus-visible:ring-2 focus-visible:ring-[#77bd21] sm:flex"
          href={phoneHref}
        >
          <Phone aria-hidden="true" className="size-2.5 fill-current" />
          {phoneDisplay}
        </a>

        <Button
          asChild
          className="mr-[15px] hidden h-[29px] min-w-[76px] rounded-none border border-[#061727] bg-[#09223a] px-2 text-[9px] font-extrabold tracking-[-0.02em] text-white uppercase shadow-none hover:bg-[#12395b] focus-visible:ring-[#77bd21] sm:inline-flex"
          size="clear"
        >
          <Link href={action.href}>{action.label}</Link>
        </Button>

        <MobileNav
          items={navItems}
          menuLabel={mobileMenuLabel}
          navigationLabel={`${navigationLabel} (mobile)`}
        />
      </div>
    </header>
  )
}
