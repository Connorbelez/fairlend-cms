'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronDown, ChevronLeft, Menu, X } from 'lucide-react'
import type { CSSProperties } from 'react'
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
type MobilePage = 'root' | 'submenu'

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
const MOBILE_PANEL_CLOSE_DURATION_FALLBACK_MS = 350
const MOBILE_PAGE_TRANSITION_DURATION_FALLBACK_MS = 250

function getMobileItemMotionStyle(order: number): CSSProperties {
  return { '--mkt-mobile-item-order': order } as CSSProperties
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getMotionDurationMs(
  element: HTMLElement | null,
  property: string,
  fallback: number,
): number {
  if (prefersReducedMotion()) {
    return 0
  }

  const value = getComputedStyle(element ?? document.documentElement)
    .getPropertyValue(property)
    .trim()
  const duration = Number.parseFloat(value)

  if (!Number.isFinite(duration)) {
    return fallback
  }

  return value.endsWith('ms') ? duration : duration * 1000
}

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
  const [isMobileMenuMounted, setIsMobileMenuMounted] = useState(false)
  const [isMobileMenuClosing, setIsMobileMenuClosing] = useState(false)
  const [mobileMenu, setMobileMenu] = useState<NavMenu | null>(null)
  const [mobilePage, setMobilePage] = useState<MobilePage>('root')
  const [isMobileSubmenuVisible, setIsMobileSubmenuVisible] = useState(false)
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const shellRef = useRef<HTMLDivElement>(null)
  const mobileToggleRef = useRef<HTMLButtonElement>(null)
  const mobileBackButtonRef = useRef<HTMLButtonElement>(null)
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const previousFocusedElementRef = useRef<HTMLElement | null>(null)
  const activeIndexRef = useRef(-1)
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mobileAnimationFrameRef = useRef<number | null>(null)
  const mobilePanelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mobilePageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
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

  const clearMobileMotion = useCallback(() => {
    if (mobileAnimationFrameRef.current !== null) {
      cancelAnimationFrame(mobileAnimationFrameRef.current)
      mobileAnimationFrameRef.current = null
    }
    if (mobilePanelTimerRef.current) {
      clearTimeout(mobilePanelTimerRef.current)
      mobilePanelTimerRef.current = null
    }
    if (mobilePageTimerRef.current) {
      clearTimeout(mobilePageTimerRef.current)
      mobilePageTimerRef.current = null
    }
  }, [])

  const resetMobileMenu = useCallback(() => {
    clearMobileMotion()
    setIsMobileMenuOpen(false)
    setIsMobileMenuMounted(false)
    setIsMobileMenuClosing(false)
    setMobileMenu(null)
    setMobilePage('root')
    setIsMobileSubmenuVisible(false)
  }, [clearMobileMotion])

  const closeMobileMenu = useCallback(() => {
    clearMobileMotion()
    mobileToggleRef.current?.focus()
    setIsMobileMenuClosing(true)
    setIsMobileMenuOpen(false)

    const closeDuration = getMotionDurationMs(
      shellRef.current,
      '--panel-close-dur',
      MOBILE_PANEL_CLOSE_DURATION_FALLBACK_MS,
    )

    mobilePanelTimerRef.current = setTimeout(() => {
      setIsMobileMenuMounted(false)
      setIsMobileMenuClosing(false)
      setMobileMenu(null)
      setMobilePage('root')
      setIsMobileSubmenuVisible(false)
      mobilePanelTimerRef.current = null
    }, closeDuration)
  }, [clearMobileMotion])

  const openMobileMenu = useCallback(() => {
    clearMobileMotion()
    setIsMobileMenuOpen(false)
    setIsMobileMenuMounted(true)
    setIsMobileMenuClosing(false)
    setMobileMenu(null)
    setMobilePage('root')
    setIsMobileSubmenuVisible(false)

    if (prefersReducedMotion()) {
      setIsMobileMenuOpen(true)
      return
    }

    mobileAnimationFrameRef.current = requestAnimationFrame(() => {
      mobileAnimationFrameRef.current = requestAnimationFrame(() => {
        setIsMobileMenuOpen(true)
        mobileAnimationFrameRef.current = null
      })
    })
  }, [clearMobileMotion])

  const openMobileSubmenu = useCallback((menu: NavMenu) => {
    if (mobileAnimationFrameRef.current !== null) {
      cancelAnimationFrame(mobileAnimationFrameRef.current)
    }
    if (mobilePageTimerRef.current) {
      clearTimeout(mobilePageTimerRef.current)
      mobilePageTimerRef.current = null
    }

    setMobileMenu(menu)
    setIsMobileSubmenuVisible(false)

    if (prefersReducedMotion()) {
      setMobilePage('submenu')
      setIsMobileSubmenuVisible(true)
      return
    }

    mobileAnimationFrameRef.current = requestAnimationFrame(() => {
      setMobilePage('submenu')
      mobileAnimationFrameRef.current = requestAnimationFrame(() => {
        setIsMobileSubmenuVisible(true)
        mobileAnimationFrameRef.current = null
      })
    })
  }, [])

  const closeMobileSubmenu = useCallback(() => {
    if (mobileAnimationFrameRef.current !== null) {
      cancelAnimationFrame(mobileAnimationFrameRef.current)
      mobileAnimationFrameRef.current = null
    }
    if (mobilePageTimerRef.current) {
      clearTimeout(mobilePageTimerRef.current)
    }

    mobileToggleRef.current?.focus()

    const pageDuration = getMotionDurationMs(
      shellRef.current,
      '--page-slide-dur',
      MOBILE_PAGE_TRANSITION_DURATION_FALLBACK_MS,
    )

    setMobilePage('root')
    mobilePageTimerRef.current = setTimeout(() => {
      setIsMobileSubmenuVisible(false)
      setMobileMenu(null)
      mobilePageTimerRef.current = null
    }, pageDuration)
  }, [])

  useEffect(() => {
    if (!isMobileMenuMounted) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    previousFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    mobileToggleRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      previousFocusedElementRef.current?.focus()
      previousFocusedElementRef.current = null
    }
  }, [isMobileMenuMounted])

  useEffect(() => {
    if (!isMobileMenuMounted) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileMenu()
        return
      }
      if (event.key !== 'Tab' || !isMobileMenuOpen) {
        return
      }

      const focusableElements = Array.from(
        shellRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
      ).filter((element) => element.offsetParent !== null && !element.closest('[inert]'))
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

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeMobileMenu, isMobileMenuMounted, isMobileMenuOpen])

  useEffect(() => {
    if (!isMobileMenuMounted || !isMobileMenuOpen) {
      return
    }

    const frame = requestAnimationFrame(() => {
      const focusTarget =
        mobilePage === 'submenu' ? mobileBackButtonRef.current : mobileToggleRef.current
      focusTarget?.focus()
    })

    return () => cancelAnimationFrame(frame)
  }, [isMobileMenuMounted, isMobileMenuOpen, mobilePage])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1280px)')
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        resetMobileMenu()
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [resetMobileMenu])

  useEffect(() => () => clearMobileMotion(), [clearMobileMotion])

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

  const isDesktopMenuVisible = !!activeMenu && !isMobileMenuMounted
  const mobileSubmenuItemOrder = new Map(
    (mobileMenu?.columns.flatMap((column) => column.items) ?? []).map(
      (item, index, items) => [item, items.length - index - 1] as const,
    ),
  )

  return (
    <header
      className={cn(
        'mkt-dhh-header',
        isHeaderHidden && !isDesktopMenuVisible && !isMobileMenuMounted && 'mkt-dhh-header-hidden',
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
          <div className="mkt-dhh-brand-slot" data-mobile-page={mobilePage}>
            <div
              aria-hidden={mobilePage === 'submenu'}
              className="mkt-dhh-brand-state"
              inert={mobilePage === 'submenu'}
            >
              <Logo />
            </div>
            <button
              aria-hidden={mobilePage !== 'submenu'}
              aria-label="Back to main navigation"
              className="mkt-dhh-back"
              onClick={closeMobileSubmenu}
              ref={mobileBackButtonRef}
              tabIndex={mobilePage === 'submenu' ? 0 : -1}
              type="button"
            >
              <ChevronLeft aria-hidden="true" className="size-4.5" strokeWidth={2} />
              Back
            </button>
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
              if (isMobileMenuMounted && !isMobileMenuClosing) {
                closeMobileMenu()
              } else {
                openMobileMenu()
              }
            }}
            ref={mobileToggleRef}
            type="button"
          >
            <span className="t-icon-swap" data-state={isMobileMenuOpen ? 'b' : 'a'}>
              <span className="t-icon" data-icon="a">
                <Menu className="size-5.5" strokeWidth={1.9} />
              </span>
              <span className="t-icon" data-icon="b">
                <X className="size-6" strokeWidth={2} />
              </span>
            </span>
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

        {!isMobileMenuMounted ? (
          <FairlendTalkToExpertCta className="mkt-dhh-hero-consult" eyebrow="Talk" label="Book" />
        ) : null}

        {isMobileMenuMounted ? (
          <nav
            aria-hidden={!isMobileMenuOpen}
            aria-label="FairLend primary navigation"
            className="mkt-dhh-mobile-panel t-panel-slide"
            data-open={isMobileMenuOpen}
            id="mobile-navigation"
            inert={!isMobileMenuOpen}
          >
            <div className="mkt-dhh-mobile-layout">
              <div
                className="mkt-dhh-mobile-pages t-page-slide"
                data-page={mobilePage === 'root' ? '1' : '2'}
              >
                <div
                  aria-hidden={mobilePage !== 'root'}
                  className="mkt-dhh-mobile-page t-page"
                  data-page-id="1"
                  inert={mobilePage !== 'root'}
                >
                  <div
                    className={cn('t-stagger', {
                      'is-hiding': isMobileMenuClosing || mobilePage === 'submenu',
                      'is-shown': isMobileMenuOpen && mobilePage === 'root',
                    })}
                  >
                    {NAV_LINKS.map((link, index) => (
                      <div
                        className="mkt-dhh-mobile-root-item t-stagger-line"
                        key={link.label}
                        style={getMobileItemMotionStyle(NAV_LINKS.length - index - 1)}
                      >
                        {link.menu ? (
                          <button
                            aria-label={`Open ${link.label} submenu`}
                            className="mkt-dhh-mobile-root-button"
                            onClick={() => openMobileSubmenu(link.menu!)}
                            type="button"
                          >
                            <span>{link.label}</span>
                            <ArrowRight aria-hidden="true" className="size-4.5" strokeWidth={2} />
                          </button>
                        ) : hasNavigableLink(link.link) ? (
                          <Link
                            {...link.link}
                            className="mkt-dhh-mobile-root-link"
                            onClick={closeMobileMenu}
                          >
                            <span>{link.label}</span>
                          </Link>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  aria-hidden={mobilePage !== 'submenu'}
                  className="mkt-dhh-mobile-page t-page"
                  data-page-id="2"
                  inert={mobilePage !== 'submenu'}
                >
                  <div
                    className={cn('t-stagger', {
                      'is-hiding':
                        isMobileMenuClosing || (mobilePage === 'root' && isMobileSubmenuVisible),
                      'is-shown':
                        isMobileMenuOpen && mobilePage === 'submenu' && isMobileSubmenuVisible,
                    })}
                  >
                    {mobileMenu?.columns.map((column, index) => (
                      <section
                        className={cn(
                          'mkt-dhh-mobile-section',
                          index !== 0 && 'mkt-dhh-mobile-section-divided',
                          column.accent && 'mkt-dhh-mobile-section-accent',
                        )}
                        key={column.heading}
                      >
                        <p className="mkt-dhh-mobile-heading">{column.heading}</p>
                        <div className="mkt-dhh-mobile-link-list">
                          {column.items.map((item) => (
                            <Link
                              {...item.link}
                              className="mkt-dhh-mobile-link t-stagger-line"
                              key={item.label}
                              onClick={closeMobileMenu}
                              style={getMobileItemMotionStyle(
                                mobileSubmenuItemOrder.get(item) ?? 0,
                              )}
                            >
                              <span className="mkt-dhh-mobile-link-label">{item.label}</span>
                              {item.description ? (
                                <span className="mkt-dhh-mobile-link-description">
                                  {item.description}
                                </span>
                              ) : null}
                            </Link>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mkt-dhh-mobile-footer">
                <HeaderActions mobile onAction={closeMobileMenu} />
              </div>
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  )
}

export default Header
