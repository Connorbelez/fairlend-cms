'use client'

import { useEffect } from 'react'

/**
 * Owns the Build Model section's progressive board state.
 *
 * The scroll panels are the accessible source of truth. The sticky board is
 * decorative and mirrors the most visible panel via data attributes.
 */
export function BuildModelMotion() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return

    const section = document.querySelector<HTMLElement>('[data-fairlend-motion="build-model"]')
    if (!section) return
    section.classList.add('is-motion-ready')

    const statuses = Array.from(section.querySelectorAll<HTMLElement>('[data-bm-board-status]'))
    const counts = Array.from(section.querySelectorAll<HTMLElement>('[data-bm-board-count]'))
    const titles = Array.from(section.querySelectorAll<HTMLElement>('[data-bm-board-title]'))
    const boardCtas = Array.from(section.querySelectorAll<HTMLAnchorElement>('[data-bm-board-cta]'))
    const primaryCta = section.querySelector<HTMLElement>('[data-bm-primary-cta]')
    const chips = Array.from(section.querySelectorAll<HTMLElement>('[data-bm-variable]'))
    const progress = Array.from(section.querySelectorAll<HTMLElement>('[data-bm-progress]'))
    const dossierTabs = Array.from(section.querySelectorAll<HTMLElement>('[data-bm-dossier-card]'))
    const steps = Array.from(section.querySelectorAll<HTMLElement>('.bm-scroll-step'))
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const compactLayoutQuery = window.matchMedia('(max-width: 1080px)')

    if (statuses.length === 0 || counts.length === 0 || titles.length === 0 || steps.length === 0) {
      return
    }

    const swapTimers = new WeakMap<HTMLElement, number>()
    const swapTimerIds = new Set<number>()
    const textSwapDuration =
      parseFloat(getComputedStyle(section).getPropertyValue('--text-swap-dur')) || 150

    const swapText = (element: HTMLElement, nextText: string) => {
      if (element.textContent === nextText) return
      if (reduceMotion) {
        element.textContent = nextText
        return
      }

      const existingTimer = swapTimers.get(element)
      if (existingTimer) {
        window.clearTimeout(existingTimer)
        swapTimerIds.delete(existingTimer)
      }

      element.classList.remove('is-enter-start')
      element.classList.add('is-exit')
      const timer = window.setTimeout(() => {
        element.textContent = nextText
        element.classList.remove('is-exit')
        element.classList.add('is-enter-start')
        void element.offsetHeight
        element.classList.remove('is-enter-start')
        swapTimerIds.delete(timer)
      }, textSwapDuration)

      swapTimers.set(element, timer)
      swapTimerIds.add(timer)
    }

    let activeStepId = 'intro'
    let activeDossierTabId = ''

    const getBoardCtaVisibility = () => {
      if (activeStepId && activeStepId !== 'intro') return true
      if (!primaryCta) return false
      return primaryCta.getBoundingClientRect().bottom < 0
    }

    const setBoardCtaVisible = () => {
      const shouldShow = compactLayoutQuery.matches || getBoardCtaVisibility()
      boardCtas.forEach((boardCta) => {
        boardCta.classList.toggle('is-visible', shouldShow)
        boardCta.setAttribute('aria-hidden', String(!shouldShow))
        boardCta.tabIndex = shouldShow ? 0 : -1
      })
    }

    const updateBoardCta = () => {
      setBoardCtaVisible()
    }

    const applyState = (step: HTMLElement) => {
      const activeVariables = (step.dataset.bmVariables ?? '')
        .split('|')
        .map((variable) => variable.trim())
        .filter(Boolean)
      const stepId = step.dataset.bmStep
      const dossierTabId = step.dataset.bmDossierTab ?? 'parcel'
      const paletteTheme = step.dataset.bmTheme ?? 'ivory'

      if (
        stepId === activeStepId &&
        section.dataset.paletteTheme === paletteTheme &&
        dossierTabId === activeDossierTabId
      ) {
        return
      }
      activeStepId = stepId ?? ''
      activeDossierTabId = dossierTabId

      statuses.forEach((status) => swapText(status, step.dataset.bmStatus ?? 'Model open'))
      counts.forEach((count) => swapText(count, step.dataset.bmCount ?? '03'))
      titles.forEach((title) => swapText(title, step.dataset.bmTitle ?? 'Property to equation'))
      section.dataset.paletteTheme = paletteTheme

      chips.forEach((chip) => {
        const isActive = activeVariables.includes(chip.dataset.bmVariable ?? '')
        chip.classList.toggle('is-active', isActive)
        chip.classList.toggle('is-lime', stepId === 'drawflow' && isActive)
      })

      progress.forEach((item) => {
        item.classList.toggle('is-active', item.dataset.bmProgress === stepId)
      })

      dossierTabs.forEach((tab) => {
        tab.classList.toggle('is-active', tab.dataset.bmDossierTab === dossierTabId)
      })

      updateBoardCta()
    }

    const getCurrentStep = () => {
      const viewportAnchor = window.innerHeight * 0.48

      return steps.reduce(
        (closest, step) => {
          const rect = step.getBoundingClientRect()
          const stepCenter = rect.top + rect.height / 2
          const distance = Math.abs(stepCenter - viewportAnchor)

          if (distance < closest.distance) {
            return { distance, step }
          }

          return closest
        },
        { distance: Number.POSITIVE_INFINITY, step: steps[0] },
      ).step
    }

    const applyCurrentStep = () => {
      applyState(getCurrentStep())
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -10% 0px' },
    )

    const stateObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target instanceof HTMLElement) applyCurrentStep()
      },
      {
        threshold: [0.24, 0.38, 0.52, 0.68],
        rootMargin: '-18% 0px -30% 0px',
      },
    )

    steps.forEach((step) => {
      revealObserver.observe(step)
      stateObserver.observe(step)
    })
    applyCurrentStep()
    updateBoardCta()

    let frame = 0
    let stateFrame = 0
    const requestBoardCtaUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        updateBoardCta()
      })
    }

    const requestStateUpdate = () => {
      if (stateFrame) return
      stateFrame = window.requestAnimationFrame(() => {
        stateFrame = 0
        applyCurrentStep()
      })
    }

    window.addEventListener('scroll', requestBoardCtaUpdate, { passive: true })
    window.addEventListener('scroll', requestStateUpdate, { passive: true })
    window.addEventListener('resize', requestBoardCtaUpdate)
    window.addEventListener('resize', requestStateUpdate)
    compactLayoutQuery.addEventListener('change', requestBoardCtaUpdate)

    return () => {
      swapTimerIds.forEach((timer) => window.clearTimeout(timer))
      if (frame) window.cancelAnimationFrame(frame)
      if (stateFrame) window.cancelAnimationFrame(stateFrame)
      window.removeEventListener('scroll', requestBoardCtaUpdate)
      window.removeEventListener('scroll', requestStateUpdate)
      window.removeEventListener('resize', requestBoardCtaUpdate)
      window.removeEventListener('resize', requestStateUpdate)
      compactLayoutQuery.removeEventListener('change', requestBoardCtaUpdate)
      revealObserver.disconnect()
      stateObserver.disconnect()
      section.classList.remove('is-motion-ready')
      delete section.dataset.paletteTheme
    }
  }, [])

  return null
}
