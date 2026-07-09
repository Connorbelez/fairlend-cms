'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { FAIRLEND_LOGO_SRC } from '@/components/Logo/Logo'
import {
  FAIRLEND_CONTACT_PHONE_HREF,
  FAIRLEND_CONTACT_PHONE_LABEL,
  FairlendTalkToExpertCta,
} from '@/components/FairlendTalkToExpertCta'
import { cn } from '@/utilities/ui'

import { MegaMenu } from './header/mega-menu'
import { fairlendNavLinks, NAV_LINKS, type NavLink, type NavMenu } from './header/nav-data'

type Direction = 'ltr' | 'rtl'
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function Logo() {
  return (
    <Link {...fairlendNavLinks.home} aria-label="FairLend Mortgage home" className="mkt-dhh-brand">
      <Image
        alt=""
        aria-hidden="true"
        className="mkt-dhh-brand-logo"
        height={240}
        src={FAIRLEND_LOGO_SRC}
        unoptimized
        width={244}
      />
      <span className="mkt-dhh-brand-word">FairLend</span>
    </Link>
  )
}

function hasNavigableLink(link?: NavLink['link']): link is NonNullable<NavLink['link']> {
  return Boolean(link)
}

function HeaderActions({ mobile = false, onAction }: { mobile?: boolean; onAction?: () => void }) {
  if (!mobile) {
    return (
      <>
        <FairlendTalkToExpertCta
          aria-label={`Call FairLend at ${FAIRLEND_CONTACT_PHONE_LABEL}`}
          className="mkt-dhh-phone-action"
          eyebrow="Talk to an expert"
          href={FAIRLEND_CONTACT_PHONE_HREF}
          label={FAIRLEND_CONTACT_PHONE_LABEL}
          onClick={onAction}
        />
      </>
    )
  }

  return (
    <div className="grid w-full grid-cols-2 gap-4">
      <Link
        {...fairlendNavLinks.backoffice}
        className="mkt-dhh-action mkt-dhh-action-secondary mkt-dhh-action-mobile"
        onClick={onAction}
      >
        Platform access
      </Link>
      <Link
        {...fairlendNavLinks.startFile}
        className="mkt-dhh-action mkt-dhh-action-primary mkt-dhh-action-mobile"
        onClick={onAction}
      >
        Start a file
        <ArrowRight className="size-3.5 shrink-0" strokeWidth={1.6} />
      </Link>
    </div>
  )
}

export function Header() {
  const [activeMenu, setActiveMenu] = useState<NavMenu | null>(null)
  const [direction, setDirection] = useState<Direction>('ltr')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const shellRef = useRef<HTMLDivElement>(null)
  const mobileToggleRef = useRef<HTMLButtonElement>(null)
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const previousFocusedElementRef = useRef<HTMLElement | null>(null)
  const activeIndexRef = useRef(-1)
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastScrollYRef = useRef(0)
  const scrollFrameRef = useRef<number | null>(null)

  const closeDesktopMenu = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current)
    }
    activeIndexRef.current = -1
    setActiveMenu(null)
  }, [])

  const openMenu = useCallback((menu: NavMenu, index: number) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current)
    }
    if (activeIndexRef.current !== -1 && activeIndexRef.current !== index) {
      setDirection(index > activeIndexRef.current ? 'rtl' : 'ltr')
    }
    activeIndexRef.current = index
    setActiveMenu(menu)
  }, [])

  const cancelClose = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current)
    }
  }, [])

  const scheduleClose = useCallback(() => {
    cancelClose()
    leaveTimerRef.current = setTimeout(closeDesktopMenu, 120)
  }, [cancelClose, closeDesktopMenu])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    previousFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileMenu()
        return
      }
      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = Array.from(
        shellRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
      ).filter((element) => element.offsetParent !== null)
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    mobileToggleRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      previousFocusedElementRef.current?.focus()
      previousFocusedElementRef.current = null
    }
  }, [closeMobileMenu, isMobileMenuOpen])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1280px)')
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        closeMobileMenu()
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [closeMobileMenu])

  useEffect(() => {
    const syncHeaderVisibility = () => {
      const currentScrollY = Math.max(window.scrollY, 0)
      const delta = currentScrollY - lastScrollYRef.current

      if (currentScrollY < 40) {
        setIsHeaderHidden(false)
      } else if (delta > 8 && currentScrollY > 108) {
        setIsHeaderHidden(true)
      } else if (delta < -8) {
        setIsHeaderHidden(false)
      }
      lastScrollYRef.current = currentScrollY
    }

    const handleScroll = () => {
      if (scrollFrameRef.current !== null) {
        return
      }
      scrollFrameRef.current = requestAnimationFrame(() => {
        syncHeaderVisibility()
        scrollFrameRef.current = null
      })
    }

    lastScrollYRef.current = window.scrollY
    syncHeaderVisibility()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current)
      }
    }
  }, [])

  const isDesktopMenuVisible = !!activeMenu && !isMobileMenuOpen

  return (
    <header
      className={cn(
        'mkt-dhh-header',
        isHeaderHidden && !isDesktopMenuVisible && !isMobileMenuOpen && 'mkt-dhh-header-hidden',
      )}
    >
      <div
        className={cn('mkt-dhh-shell', {
          'mkt-dhh-shell-closed mkt-dhh-shell-clipped': !isDesktopMenuVisible && !isMobileMenuOpen,
          'mkt-dhh-shell-desktop-open': isDesktopMenuVisible,
          'mkt-dhh-shell-mobile-open': isMobileMenuOpen,
        })}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        ref={shellRef}
      >
        <div className="mkt-dhh-bar">
          <div className="mkt-dhh-brand-slot">
            <Logo />
          </div>

          <nav aria-label="FairLend primary navigation" className="mkt-dhh-desktop-nav">
            {NAV_LINKS.map((link, index) => {
              const isOpen = link.menu?.id === activeMenu?.id

              return link.menu ? (
                <button
                  aria-controls="desktop-mega-menu"
                  aria-expanded={isOpen}
                  aria-haspopup="menu"
                  className={cn('mkt-dhh-nav-item', isOpen && 'mkt-dhh-nav-item-open')}
                  key={link.label}
                  onClick={() => openMenu(link.menu!, index)}
                  onFocus={() => openMenu(link.menu!, index)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      closeDesktopMenu()
                      event.currentTarget.focus()
                    }
                  }}
                  onMouseEnter={() => openMenu(link.menu!, index)}
                  type="button"
                >
                  {link.label}
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      'size-3.5 transition-transform duration-200',
                      isOpen && 'rotate-180',
                    )}
                    strokeWidth={1.8}
                  />
                </button>
              ) : hasNavigableLink(link.link) ? (
                <Link
                  {...link.link}
                  className="mkt-dhh-nav-item"
                  key={link.label}
                  onClick={closeDesktopMenu}
                  onFocus={closeDesktopMenu}
                  onMouseEnter={closeDesktopMenu}
                >
                  {link.label}
                </Link>
              ) : null
            })}
          </nav>

          <div className="mkt-dhh-actions">
            <HeaderActions onAction={closeDesktopMenu} />
          </div>

          <button
            aria-controls="mobile-navigation"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            className="mkt-dhh-mobile-toggle"
            onClick={() => {
              closeDesktopMenu()
              setIsMobileMenuOpen((open) => !open)
            }}
            ref={mobileToggleRef}
            type="button"
          >
            {isMobileMenuOpen ? (
              <X className="size-6" strokeWidth={2} />
            ) : (
              <Menu className="size-5.5" strokeWidth={1.9} />
            )}
          </button>
        </div>

        <MegaMenu
          direction={direction}
          menu={isDesktopMenuVisible ? activeMenu : null}
          onEscape={closeDesktopMenu}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          panelRef={megaMenuRef}
        />

        {!isMobileMenuOpen ? (
          <FairlendTalkToExpertCta className="mkt-dhh-hero-consult" eyebrow="Talk" label="Book" />
        ) : null}

        {isMobileMenuOpen ? (
          <nav
            aria-label="FairLend primary navigation"
            className="mkt-dhh-mobile-panel"
            id="mobile-navigation"
          >
            <div className="mkt-dhh-mobile-scroll">
              {NAV_LINKS.map((link) =>
                link.menu ? (
                  <section className="mkt-dhh-mobile-section" key={link.label}>
                    <p className="mkt-dhh-mobile-heading">{link.label}</p>
                    <div className="mkt-dhh-mobile-link-list">
                      {link.menu.columns.flatMap((column) =>
                        column.items.map((item) => (
                          <Link
                            {...item.link}
                            className="mkt-dhh-mobile-link"
                            key={item.label}
                            onClick={closeMobileMenu}
                          >
                            <span className="mkt-dhh-mobile-link-label">{item.label}</span>
                          </Link>
                        )),
                      )}
                    </div>
                  </section>
                ) : hasNavigableLink(link.link) ? (
                  <div className="mkt-dhh-mobile-root-item" key={link.label}>
                    <Link
                      {...link.link}
                      className="mkt-dhh-mobile-root-link"
                      onClick={closeMobileMenu}
                    >
                      {link.label}
                    </Link>
                  </div>
                ) : null,
              )}
            </div>
            <div className="mkt-dhh-mobile-footer">
              <HeaderActions mobile onAction={closeMobileMenu} />
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  )
}

export default Header
