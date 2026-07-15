'use client'

const DEFERRED_HOME_STYLES_HREF = '/assets/css/fairlend-deferred-home.css'

let deferredHomeStylesPromise: Promise<void> | null = null

/** Load the precompiled below-fold utility bundle once, immediately before reveal. */
export function loadDeferredHomeStyles(): Promise<void> {
  deferredHomeStylesPromise ??= new Promise((resolve) => {
    const existing = document.querySelector<HTMLLinkElement>(
      `link[href="${DEFERRED_HOME_STYLES_HREF}"]`,
    )
    if (existing?.sheet) {
      resolve()
      return
    }

    const link = existing ?? document.createElement('link')
    link.rel = 'stylesheet'
    link.href = DEFERRED_HOME_STYLES_HREF
    link.addEventListener('load', () => resolve(), { once: true })
    // Fail open: a transient stylesheet failure must not make the homepage's
    // services, content, or footer permanently unreachable.
    link.addEventListener('error', () => resolve(), { once: true })
    if (!existing) document.head.append(link)
  })

  return deferredHomeStylesPromise
}
