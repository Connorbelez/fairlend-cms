'use client'

import { cn } from '@/utilities/ui'
import { useInView } from 'motion/react'
import React from 'react'
import { AspectRatio } from '@/components/ui/aspect-ratio'

type LazyImageProps = {
  alt: string
  src: string
  className?: string
  containerClassName?: string
  /** URL of the fallback image. default: undefined */
  fallback?: string
  /** The ratio of the image. */
  ratio: number
  /** Whether the image should only load when it is in view. default: false */
  inView?: boolean
}

export function LazyImage({
  alt,
  src,
  ratio,
  fallback,
  inView = false,
  className,
  containerClassName,
}: LazyImageProps) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const imgRef = React.useRef<HTMLImageElement | null>(null)
  const isInView = useInView(ref, { once: true })

  const shouldLoad = !inView || isInView
  const [useFallback, setUseFallback] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const imgSrc = shouldLoad ? (useFallback && fallback ? fallback : src) : undefined

  const handleError = () => {
    if (fallback) {
      setUseFallback(true)
    }
    setIsLoading(false)
  }

  const handleLoad = React.useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <AspectRatio
      className={cn('relative size-full overflow-hidden border bg-accent/30', containerClassName)}
      ratio={ratio}
      ref={ref}
    >
      {imgSrc && (
        // biome-ignore lint/correctness/useImageSize: dynamic image size
        <img
          alt={alt}
          className={cn(
            'size-full object-cover transition-opacity duration-500',
            isLoading ? 'opacity-0' : 'opacity-100',
            className,
          )}
          decoding="async"
          fetchPriority={inView ? 'high' : 'low'}
          loading="lazy"
          onError={handleError}
          onLoad={handleLoad}
          ref={imgRef}
          role="presentation" // Changed from "img" to "presentation" since it's decorative
          src={imgSrc}
        />
      )}
    </AspectRatio>
  )
}
