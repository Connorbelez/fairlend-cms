import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const EASE = 'power4.out'

function elements(root: Element, selector: string): HTMLElement[] {
  return gsap.utils.toArray<HTMLElement>(root.querySelectorAll(selector))
}

function element(root: Element, selector: string): HTMLElement | null {
  return root.querySelector<HTMLElement>(selector)
}

function revealCopy(
  root: HTMLElement,
  selector: string,
  options: { start?: string; y?: number; stagger?: number } = {},
) {
  const targets = elements(root, selector)
  if (targets.length === 0) return

  gsap.fromTo(
    targets,
    { autoAlpha: 0.76, filter: 'blur(3px)', y: options.y ?? 20 },
    {
      autoAlpha: 1,
      duration: 0.82,
      ease: EASE,
      filter: 'blur(0px)',
      stagger: options.stagger ?? 0.07,
      y: 0,
      scrollTrigger: {
        once: true,
        start: options.start ?? 'top 76%',
        trigger: root,
      },
    },
  )
}

function stampItems(
  root: HTMLElement,
  selector: string,
  options: { start?: string; stagger?: number; x?: number; y?: number } = {},
) {
  const targets = elements(root, selector)
  if (targets.length === 0) return

  gsap.fromTo(
    targets,
    {
      autoAlpha: 0.78,
      rotate: -0.7,
      scale: 0.975,
      x: options.x ?? 0,
      y: options.y ?? 14,
    },
    {
      autoAlpha: 1,
      duration: 0.66,
      ease: EASE,
      rotate: 0,
      scale: 1,
      stagger: options.stagger ?? 0.055,
      x: 0,
      y: 0,
      scrollTrigger: {
        once: true,
        start: options.start ?? 'top 70%',
        trigger: root,
      },
    },
  )
}

function scrubArtwork(
  root: HTMLElement,
  selector: string,
  from: gsap.TweenVars,
  to: gsap.TweenVars,
) {
  const target = element(root, selector)
  if (!target) return

  gsap.fromTo(target, from, {
    ...to,
    ease: 'none',
    scrollTrigger: {
      end: 'bottom top',
      scrub: 0.8,
      start: 'top bottom',
      trigger: root,
    },
  })
}

/**
 * Editorial Kinetic Ink choreography for the investor landing page.
 *
 * Every section remains fully visible before this enhancement initializes.
 * GSAP only moves already-rendered content from a legible, near-final state.
 */
export function createInvestorChoreography(): () => void {
  const context = gsap.context(() => {
    const hero = document.querySelector<HTMLElement>('[data-investor-hero]')
    if (hero) {
      const copy = elements(
        hero,
        '.investor-hero__kicker, .investor-hero__title, .investor-hero__subhead, .investor-hero__framework-link',
      )
      const form = element(hero, '.investor-hero__form-slot')
      const route = element(hero, '.investor-hero__route path:first-child')
      const routeMarks = elements(hero, '.investor-hero__route circle, .investor-hero__route-arrow')

      const entrance = gsap.timeline({ defaults: { ease: EASE } })
      entrance.fromTo(
        copy,
        { autoAlpha: 0.76, clipPath: 'inset(0 0 22% 0)', filter: 'blur(4px)', y: 26 },
        {
          autoAlpha: 1,
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.86,
          filter: 'blur(0px)',
          stagger: 0.09,
          y: 0,
        },
        0.08,
      )
      if (form) {
        entrance.fromTo(
          form,
          { autoAlpha: 0.82, clipPath: 'inset(0 0 10% 0)', x: 24 },
          { autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.88, x: 0 },
          0.18,
        )
      }
      if (route) {
        entrance.fromTo(
          route,
          { strokeDasharray: 860, strokeDashoffset: 860 },
          { duration: 1.05, ease: 'power3.inOut', strokeDashoffset: 0 },
          0.32,
        )
      }
      entrance.fromTo(
        routeMarks,
        { autoAlpha: 0.35, scale: 0.7, transformOrigin: 'center' },
        { autoAlpha: 1, duration: 0.36, scale: 1, stagger: 0.1 },
        0.74,
      )
      stampItems(hero, '.investor-hero__proof li', { start: 'top 90%', stagger: 0.06, y: 8 })
      scrubArtwork(hero, '.investor-hero__skyline', { yPercent: -2 }, { yPercent: 5 })
      scrubArtwork(hero, '.investor-hero__property', { scale: 1.045, yPercent: 2 }, { scale: 1, yPercent: -3 })
    }

    const primer = document.querySelector<HTMLElement>('[data-investor-primer]')
    if (primer) {
      revealCopy(primer, '.investor-primer__title, .investor-primer__lede', { start: 'top 78%' })
      const dossier = element(primer, '.investor-primer__dossier')
      if (dossier) {
        gsap.fromTo(
          dossier,
          { autoAlpha: 0.82, clipPath: 'inset(14% 0 0 0)', rotate: 0.8, y: 18 },
          {
            autoAlpha: 1,
            clipPath: 'inset(0% 0 0 0)',
            duration: 0.9,
            ease: EASE,
            rotate: 0,
            scrollTrigger: { once: true, start: 'top 72%', trigger: primer },
            y: 0,
          },
        )
      }
      stampItems(primer, '[data-investor-primer-node]', { start: 'top 64%', stagger: 0.12, x: 18, y: 0 })
      scrubArtwork(primer, '.investor-primer__dossier-image img', { scale: 1.06, yPercent: -2 }, { scale: 1.01, yPercent: 3 })
    }

    const rate = document.querySelector<HTMLElement>('[data-investor-rate]')
    if (rate) {
      revealCopy(rate, '.investor-rate__eyebrow, .investor-rate__title', { start: 'top 78%', stagger: 0.11 })
      const panel = element(rate, '.investor-rate__panel')
      if (panel) {
        gsap.fromTo(
          panel,
          { autoAlpha: 0.84, clipPath: 'inset(0 9% 0 0)', x: 28 },
          {
            autoAlpha: 1,
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.92,
            ease: EASE,
            scrollTrigger: { once: true, start: 'top 72%', trigger: rate },
            x: 0,
          },
        )
      }
      const rule = element(rate, '.investor-rate__title-rule')
      if (rule) {
        gsap.fromTo(rule, { scaleX: 0.1, transformOrigin: 'left' }, {
          duration: 0.8,
          ease: EASE,
          scaleX: 1,
          scrollTrigger: { once: true, start: 'top 72%', trigger: rate },
        })
      }
      stampItems(rate, '.investor-rate__check', { start: 'top 64%', stagger: 0.07, x: 12, y: 0 })
    }

    const protection = document.querySelector<HTMLElement>('[data-investor-protection-stack]')
    if (protection) {
      revealCopy(
        protection,
        '.investor-protection__eyebrow, .investor-protection__title, .investor-protection__lede',
        { start: 'top 78%' },
      )
      stampItems(protection, '[data-investor-protection-band]', {
        start: 'top 68%',
        stagger: 0.08,
        x: -20,
        y: 0,
      })
    }

    const managed = document.querySelector<HTMLElement>('[data-investor-managed]')
    if (managed) {
      revealCopy(managed, '.investor-managed__title, .investor-managed__lede')
      const columns = elements(managed, '.investor-managed__column')
      if (columns.length) {
        gsap.fromTo(
          columns,
          { autoAlpha: 0.8, clipPath: 'inset(0 4% 0 4%)', xPercent: (index) => index === 0 ? -3 : 3 },
          {
            autoAlpha: 1,
            clipPath: 'inset(0 0% 0 0%)',
            duration: 0.86,
            ease: EASE,
            stagger: 0.09,
            scrollTrigger: { once: true, start: 'top 68%', trigger: managed },
            xPercent: 0,
          },
        )
      }
      stampItems(managed, '.investor-managed__column--fairlend .investor-managed__list-item', {
        start: 'top 58%',
        stagger: 0.045,
        x: 12,
        y: 0,
      })
    }

    const portal = document.querySelector<HTMLElement>('[data-investor-portal]')
    if (portal) {
      revealCopy(portal, '.investor-portal__eyebrow, .investor-portal__title, .investor-portal__lede')
      const ui = element(portal, '.investor-portal__ui')
      if (ui) {
        gsap.fromTo(
          ui,
          { autoAlpha: 0.84, filter: 'grayscale(1) contrast(0.88)', rotateX: 3, transformPerspective: 1200, y: 28 },
          {
            autoAlpha: 1,
            duration: 1,
            ease: EASE,
            filter: 'grayscale(0) contrast(1)',
            rotateX: 0,
            scrollTrigger: { once: true, start: 'top 70%', trigger: portal },
            y: 0,
          },
        )
      }
      stampItems(portal, '.investor-portal__callout', { start: 'top 60%', stagger: 0.07, x: 14, y: 0 })
      scrubArtwork(portal, '.investor-portal__ui', { yPercent: 2 }, { yPercent: -2 })
    }

    const opportunities = document.querySelector<HTMLElement>('[data-investor-opportunities]')
    if (opportunities) {
      revealCopy(opportunities, '.investor-opportunities__title, .investor-opportunities__lede')
      const deal = element(opportunities, '.investor-opportunities__deal')
      if (deal) {
        gsap.fromTo(
          deal,
          { autoAlpha: 0.82, clipPath: 'inset(0 0 10% 0)', rotate: -0.45, y: 26 },
          {
            autoAlpha: 1,
            clipPath: 'inset(0 0 0% 0)',
            duration: 0.96,
            ease: EASE,
            rotate: 0,
            scrollTrigger: { once: true, start: 'top 69%', trigger: opportunities },
            y: 0,
          },
        )
      }
      stampItems(opportunities, '.investor-opportunities__deal-stat', { start: 'top 58%', stagger: 0.06, y: 10 })
      stampItems(opportunities, '.investor-opportunities__package-item', { start: 'top 52%', stagger: 0.028, x: 8, y: 0 })
    }

    const fractional = document.querySelector<HTMLElement>('[data-investor-fractional]')
    if (fractional) {
      revealCopy(fractional, '.investor-fractional__title, .investor-fractional__lede')
      stampItems(fractional, '.investor-fractional__figure, .investor-fractional__note', {
        start: 'top 68%',
        stagger: 0.14,
        x: 18,
        y: 0,
      })
      const slices = elements(fractional, '.investor-fractional__slice')
      if (slices.length) {
        gsap.fromTo(slices, { scaleX: 0.16, transformOrigin: 'left' }, {
          duration: 0.66,
          ease: EASE,
          scaleX: 1,
          stagger: 0.07,
          scrollTrigger: { once: true, start: 'top 62%', trigger: fractional },
        })
      }
      const arrow = element(fractional, '.investor-fractional__arrow')
      if (arrow) {
        gsap.fromTo(arrow, { autoAlpha: 0.4, x: -14 }, {
          autoAlpha: 1,
          duration: 0.58,
          ease: EASE,
          scrollTrigger: { once: true, start: 'top 66%', trigger: fractional },
          x: 0,
        })
      }
    }

    const regulator = document.querySelector<HTMLElement>('[data-investor-regulator]')
    if (regulator) {
      revealCopy(regulator, '.investor-regulator__eyebrow, .investor-regulator__title, .investor-regulator__lede', { start: 'top 82%' })
      stampItems(regulator, '.investor-regulator__link', { start: 'top 76%', x: 12, y: 0 })
    }

    const process = document.querySelector<HTMLElement>('[data-investor-process]')
    if (process) {
      revealCopy(process, '.investor-process__eyebrow, .investor-process__title, .investor-process__lede')
      stampItems(process, '.investor-process__step', { start: 'top 68%', stagger: 0.09, x: -14, y: 0 })
      const lines = elements(process, '.investor-process__step-line')
      if (lines.length) {
        gsap.fromTo(lines, { scaleY: 0, transformOrigin: 'top' }, {
          duration: 0.58,
          ease: 'power3.inOut',
          scaleY: 1,
          stagger: 0.08,
          scrollTrigger: { once: true, start: 'top 64%', trigger: process },
        })
      }
    }

    const leadership = document.querySelector<HTMLElement>('[data-investor-leadership]')
    if (leadership) {
      revealCopy(leadership, '.investor-leadership__title')
      const plate = element(leadership, '.investor-leadership__ink-plate')
      if (plate) {
        gsap.fromTo(
          plate,
          { autoAlpha: 0.82, clipPath: 'inset(0 18% 0 0)', filter: 'contrast(1.4) grayscale(1)', rotate: 0.7 },
          {
            autoAlpha: 1,
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.94,
            ease: EASE,
            filter: 'contrast(1) grayscale(0)',
            rotate: 0,
            scrollTrigger: { once: true, start: 'top 72%', trigger: leadership },
          },
        )
      }
      stampItems(leadership, '.investor-leadership__stat', { start: 'top 62%', stagger: 0.09, y: 14 })
      stampItems(leadership, '.investor-leadership__person', { start: 'top 54%', stagger: 0.07, x: 12, y: 0 })
      scrubArtwork(leadership, '.investor-leadership__ink-plate img', { scale: 1.07, yPercent: -3 }, { scale: 1.01, yPercent: 3 })
    }

    const fit = document.querySelector<HTMLElement>('[data-investor-fit]')
    if (fit) {
      revealCopy(fit, '.investor-fit__title, .investor-fit__lede')
      const columns = elements(fit, '.investor-fit__column')
      if (columns.length) {
        gsap.fromTo(
          columns,
          { autoAlpha: 0.8, xPercent: (index) => index === 0 ? -4 : 4 },
          {
            autoAlpha: 1,
            duration: 0.82,
            ease: EASE,
            stagger: 0.09,
            scrollTrigger: { once: true, start: 'top 68%', trigger: fit },
            xPercent: 0,
          },
        )
      }
      stampItems(fit, '.investor-fit__list-item', { start: 'top 58%', stagger: 0.045, x: 8, y: 0 })
    }

    const faq = document.querySelector<HTMLElement>('[data-investor-faq]')
    if (faq) {
      revealCopy(faq, '.investor-faq__title')
      stampItems(faq, '.investor-faq__group', { start: 'top 70%', stagger: 0.1, x: 12, y: 0 })
    }

    const finalCta = document.querySelector<HTMLElement>('[data-investor-final]')
    if (finalCta) {
      const inner = element(finalCta, '.investor-final__inner')
      if (inner) {
        gsap.fromTo(
          inner,
          { autoAlpha: 0.78, clipPath: 'inset(12% 0 12% 0)', filter: 'blur(4px)', scale: 0.985 },
          {
            autoAlpha: 1,
            clipPath: 'inset(0% 0 0% 0)',
            duration: 1,
            ease: EASE,
            filter: 'blur(0px)',
            scale: 1,
            scrollTrigger: { once: true, start: 'top 72%', trigger: finalCta },
          },
        )
      }
      stampItems(finalCta, '.investor-final__cta-row > *', { start: 'top 60%', stagger: 0.12, y: 12 })
    }
  })

  ScrollTrigger.refresh()

  return () => context.revert()
}
