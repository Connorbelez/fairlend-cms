'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

const gardenSuiteChapters = [
  { href: '#section-2', id: 'section-2', label: 'Plan' },
  { href: '#section-3', id: 'section-3', label: 'How it works' },
  { href: '#section-4', id: 'section-4', label: 'One team' },
  { href: '#section-5', id: 'section-5', label: 'Milestone draws' },
] as const

export function GardenSuiteChapterNav() {
  const navRef = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState<string>(gardenSuiteChapters[0].id)

  useEffect(() => {
    const sections = gardenSuiteChapters
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    if (sections.length === 0) return

    let frame = 0

    const updateActiveChapter = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const activationLine = (navRef.current?.getBoundingClientRect().bottom ?? 0) + 1
        const activeSection = sections.reduce((current, section) => {
          return section.getBoundingClientRect().top <= activationLine ? section : current
        }, sections[0]!)

        setActiveId((current) => (current === activeSection.id ? current : activeSection.id))
      })
    }

    updateActiveChapter()
    window.addEventListener('hashchange', updateActiveChapter)
    window.addEventListener('scroll', updateActiveChapter, { passive: true })
    window.addEventListener('resize', updateActiveChapter)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', updateActiveChapter)
      window.removeEventListener('scroll', updateActiveChapter)
      window.removeEventListener('resize', updateActiveChapter)
    }
  }, [])

  return (
    <div className="sticky top-0 z-50" ref={navRef}>
      <nav
        aria-label="Garden Suite financing page chapters"
        className="relative flex min-h-12 items-stretch overflow-x-auto border-y border-[var(--gs-ink)] bg-[rgb(248_247_242/94%)] shadow-[0_6px_0_rgb(7_21_34/9%)] backdrop-blur-[12px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {gardenSuiteChapters.map((chapter) => {
          const isActive = chapter.id === activeId

          return (
            <a
              aria-current={isActive ? 'location' : undefined}
              className={cn(
                "relative grid min-h-12 min-w-[150px] flex-1 place-items-center border-e border-[rgb(7_21_34/22%)] px-4 text-center text-[0.6875rem] leading-none font-extrabold tracking-[0.12em] no-underline uppercase transition-colors duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] [font-family:var(--font-oxanium),ui-monospace,monospace] after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:origin-left after:scale-x-0 after:bg-[var(--gs-lime)] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)] after:content-[''] last:border-e-0 hover:bg-[var(--gs-ink)] hover:!text-[var(--gs-lime)]",
                isActive && 'bg-[var(--gs-ink)] !text-[var(--gs-white-paper)] after:scale-x-100',
              )}
              href={chapter.href}
              key={chapter.href}
            >
              {chapter.label}
            </a>
          )
        })}
      </nav>
    </div>
  )
}
