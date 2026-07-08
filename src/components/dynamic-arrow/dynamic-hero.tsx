'use client'

import { useEffect, useMemo, useRef, useState, type ComponentPropsWithoutRef } from 'react'

import {
  DynamicArrowCanvas,
  type DynamicArrowOrigin,
  type DynamicArrowTarget,
} from './dynamic-arrow-canvas'

type HeroNavItem = {
  href?: string
  id: string
  label: string
  onClick?: () => void
  target?: ComponentPropsWithoutRef<'a'>['target']
}

type HeroSectionProps = {
  buttonText?: string
  heading?: string
  imageUrl?: string
  navItems?: HeroNavItem[]
  tagline?: string
  videoUrl?: string
}

type PlayIconProps = {
  className?: string
}

const PlayIcon = ({ className = 'h-6 w-6' }: PlayIconProps) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 5V19L19 12L8 5Z" />
  </svg>
)

const defaultNavItems = [
  { id: 'home', label: 'Home' },
  { href: '#about-section', id: 'about', label: 'About' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'get-started-nav', label: 'Get Started' },
] satisfies HeroNavItem[]

export function HeroSection({
  buttonText = 'Get Started',
  heading = 'Something you really want',
  imageUrl,
  navItems = defaultNavItems,
  tagline = "You can't live without this product. I'm sure of it.",
  videoUrl,
}: HeroSectionProps) {
  const targetRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showVideo, setShowVideo] = useState(false)
  const arrowOrigin = useMemo<DynamicArrowOrigin>(
    () => ({
      type: 'pointer',
    }),
    [],
  )
  const arrowTarget = useMemo<DynamicArrowTarget>(
    () => ({
      getElement: () => targetRef.current,
      type: 'element',
    }),
    [],
  )

  useEffect(() => {
    const videoElement = videoRef.current

    if (!videoElement || !videoUrl) {
      return
    }

    const handleVideoEnd = () => {
      setShowVideo(false)
      videoElement.currentTime = 0
    }

    if (showVideo) {
      videoElement.play().catch(() => {
        setShowVideo(false)
      })
      videoElement.addEventListener('ended', handleVideoEnd)
    } else {
      videoElement.pause()
    }

    return () => {
      videoElement.removeEventListener('ended', handleVideoEnd)
    }
  }, [showVideo, videoUrl])

  const handlePlayButtonClick = () => {
    if (videoUrl) {
      setShowVideo(true)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <nav className="mx-auto flex w-full max-w-screen-md flex-wrap items-center justify-center px-4 py-4 text-sm sm:justify-between sm:px-8">
        {navItems.map((item) => {
          const className =
            'whitespace-nowrap rounded-md px-3 py-2 text-muted-foreground transition-colors duration-150 ease-in-out hover:bg-accent/10 hover:text-foreground focus:ring-2 focus:ring-ring focus:outline-none dark:hover:bg-accent/20 sm:px-4'

          if (item.href) {
            return (
              <a
                className={className}
                href={item.href}
                key={item.id}
                onClick={item.onClick}
                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                target={item.target}
              >
                {item.label}
              </a>
            )
          }

          return (
            <button className={className} key={item.id} onClick={item.onClick} type="button">
              {item.label}
            </button>
          )
        })}
      </nav>

      <main className="flex flex-grow flex-col items-center justify-center">
        <div className="mt-12 flex flex-col items-center sm:mt-16 lg:mt-24">
          <h1 className="px-4 text-center text-3xl font-medium sm:text-4xl lg:text-5xl">
            {heading}
          </h1>
          <p className="mt-3 block max-w-xl px-4 text-center text-base text-muted-foreground sm:text-lg">
            {tagline}
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            className="rounded-xl border border-foreground/50 px-4 py-2 text-foreground transition-colors hover:border-foreground/80 focus:ring-2 focus:ring-ring focus:outline-none"
            ref={targetRef}
            type="button"
          >
            {buttonText}
          </button>
        </div>

        <div className="mx-auto mt-12 w-full max-w-screen-sm overflow-hidden px-4 sm:px-2 lg:mt-16">
          <div className="rounded-[2rem] bg-border p-[0.25rem]">
            <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-[1.75rem] bg-card sm:h-72 md:h-80 lg:h-96">
              {imageUrl ? (
                // The original dynamic-arrow demo accepts arbitrary image URLs, so this remains a plain img.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt="Preview"
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                    showVideo ? 'pointer-events-none opacity-0' : 'opacity-100'
                  }`}
                  src={imageUrl}
                />
              ) : null}

              {videoUrl ? (
                <video
                  className={`h-full w-full object-cover transition-opacity duration-300 ${
                    showVideo ? 'opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                  muted
                  playsInline
                  ref={videoRef}
                  src={videoUrl}
                />
              ) : null}

              {!showVideo && videoUrl && imageUrl ? (
                <button
                  aria-label="Play video"
                  className="absolute bottom-3 left-3 z-20 rounded-full bg-accent/30 p-2 text-accent-foreground backdrop-blur-sm transition-colors hover:bg-accent/50 focus:ring-2 focus:ring-ring focus:outline-none sm:bottom-4 sm:left-4 sm:p-3"
                  onClick={handlePlayButtonClick}
                  type="button"
                >
                  <PlayIcon className="h-4 w-4 sm:h-6 sm:w-5" />
                </button>
              ) : null}

              {!imageUrl && !videoUrl ? (
                <div className="text-muted-foreground italic">Card Content Area</div>
              ) : null}
            </div>
          </div>
        </div>
      </main>

      <div className="h-12 sm:h-16 md:h-24" />
      <DynamicArrowCanvas
        dashPattern={[10, 5]}
        edgeOffset={12}
        lineWidth={2}
        origin={arrowOrigin}
        position="fixed"
        respectReducedMotion={false}
        strokeColor="var(--foreground)"
        target={arrowTarget}
      />
    </div>
  )
}
