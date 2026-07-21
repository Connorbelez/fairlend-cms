'use client'

import { useSyncExternalStore } from 'react'

const milestoneNodes = [
  'Foundation',
  'Framing',
  'Roof',
  'Windows',
  'Mechanical',
  'Plumbing',
  'Electrical',
  'Drywall',
  'Flooring',
] as const

const mobileRailQuery = '(max-width: 720px)'

function subscribeToMobileRail(callback: () => void) {
  const media = window.matchMedia(mobileRailQuery)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

function getMobileRailSnapshot() {
  return window.matchMedia(mobileRailQuery).matches
}

export function DrawFlowMilestoneRail() {
  const hasScrollableRail = useSyncExternalStore(
    subscribeToMobileRail,
    getMobileRailSnapshot,
    () => false,
  )

  return (
    <ol
      aria-label="Illustrative milestone draw sequence"
      className="bm-milestones"
      tabIndex={hasScrollableRail ? 0 : undefined}
    >
      {milestoneNodes.map((node, index) => (
        <li
          aria-current={node === 'Plumbing' ? 'step' : undefined}
          className={[
            'bm-milestone',
            index < 5 ? 'done' : '',
            node === 'Plumbing' ? 'active' : '',
            node === 'Flooring' ? 'bm-milestone--continuation' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          key={`bm-ms-${node}`}
        >
          <span className="sr-only">
            {index < 5
              ? 'Completed illustrative checkpoint: '
              : node === 'Plumbing'
                ? 'Current illustrative checkpoint: '
                : 'Upcoming illustrative checkpoint: '}
          </span>
          {node}
        </li>
      ))}
    </ol>
  )
}
