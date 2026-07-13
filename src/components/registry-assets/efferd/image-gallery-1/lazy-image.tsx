'use client'

import Image from 'next/image'

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

  const [fallbackSrc, setFallbackSrc] = React.useState<string>()
  const imgSrc = fallbackSrc ?? (inView && !isInView ? undefined : src)
  const [isLoading, setIsLoading] = React.useState(true)

  const handleError = () => {
    if (fallback) {
      setFallbackSrc(fallback)
    }
    setIsLoading(false)
  }

  const handleLoad = React.useCallback(() => {
    setIsLoading(false)
  }, [])

  // Handle cached images instantly
  React.useEffect(() => {
    if (imgRef.current?.complete) {
      handleLoad()
    }
  }, [handleLoad])

  return (
    <AspectRatio
      className={cn('relative size-full overflow-hidden border bg-accent/30', containerClassName)}
      ratio={ratio}
      ref={ref}
    >
      {imgSrc && (
        <Image
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
        
          width={96}
          height={96}
          sizes="96px"/>
      )}
    </AspectRatio>
  )
}
