import type React from 'react'

import { cn } from '@/utilities/ui'

export type TextureVariant =
  | 'fabric-of-squares'
  | 'grid-noise'
  | 'inflicted'
  | 'debut-light'
  | 'groovepaper'
  | 'paper-grain'
  | 'none'

interface BackgroundImageTextureProps {
  variant?: TextureVariant
  opacity?: number
  className?: string
  children?: React.ReactNode
}

const textureMap: Record<Exclude<TextureVariant, 'none'>, React.CSSProperties> = {
  'fabric-of-squares': {
    backgroundImage: 'url(/textures/fabric-of-squares.png)',
    backgroundRepeat: 'repeat',
  },
  'grid-noise': {
    backgroundImage: 'url(/textures/grid-noise.png)',
    backgroundRepeat: 'repeat',
  },
  inflicted: {
    backgroundImage: 'url(/textures/inflicted.png)',
    backgroundRepeat: 'repeat',
  },
  'debut-light': {
    backgroundImage: 'url(/textures/debut-light.png)',
    backgroundRepeat: 'repeat',
  },
  groovepaper: {
    backgroundImage: 'url(/textures/groovepaper.png)',
    backgroundRepeat: 'repeat',
  },
  'paper-grain': {
    backgroundImage:
      'repeating-linear-gradient(0deg, rgb(0 0 0 / 10%) 0, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgb(0 0 0 / 10%) 0, transparent 1px, transparent 4px), repeating-linear-gradient(45deg, rgb(0 0 0 / 5%) 0, transparent 1px, transparent 5px)',
  },
}

export function BackgroundImageTexture({
  variant = 'fabric-of-squares',
  opacity = 0.5,
  className,
  children,
}: BackgroundImageTextureProps) {
  const textureStyle = variant !== 'none' ? textureMap[variant] : null

  return (
    <div className={cn('relative', className)}>
      {textureStyle && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            ...textureStyle,
            opacity: `var(--background-image-texture-opacity, ${opacity})`,
          }}
        />
      )}
      {children && <div className="relative">{children}</div>}
    </div>
  )
}
