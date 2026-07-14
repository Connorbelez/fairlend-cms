'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef } from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName, videoOptions } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  // const [showFallback] = useState<boolean>()

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // setShowFallback(true);
        // console.warn('Video was suspended, rendering fallback image.')
      })
    }
  }, [])

  if (resource && typeof resource === 'object') {
    const { filename, url } = resource
    const posterResource = videoOptions?.posterResource
    const poster =
      posterResource && typeof posterResource === 'object' && posterResource.url
        ? getMediaUrl(posterResource.url, posterResource.updatedAt)
        : undefined

    return (
      <video
        autoPlay={videoOptions?.autoPlay ?? true}
        className={cn(videoClassName)}
        controls={videoOptions?.controls ?? false}
        loop={videoOptions?.loop ?? true}
        muted={videoOptions?.muted ?? true}
        onClick={onClick}
        playsInline
        poster={poster}
        preload="metadata"
        ref={videoRef}
      >
        <source src={getMediaUrl(url || `/media/${filename}`, resource.updatedAt)} type={resource.mimeType || undefined} />
      </video>
    )
  }

  return null
}
