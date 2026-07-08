import React from 'react'

export default function LogoIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={className}
      data-watermelon-logo-icon
    >
      <svg viewBox="0 0 32 32" fill="none" className="size-full">
        <rect width="32" height="32" rx="8" fill="currentColor" opacity="0.12" />
        <path d="M8 20.5 14.2 9h3.6L24 20.5h-3.2l-1.2-2.4h-7.2l-1.2 2.4H8Zm5.6-4.9h4.8L16 10.8l-2.4 4.8Z" fill="currentColor" />
      </svg>
    </span>
  )
}
