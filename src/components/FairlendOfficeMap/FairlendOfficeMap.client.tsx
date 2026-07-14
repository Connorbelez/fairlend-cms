'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { ExternalLink } from 'lucide-react'
import type { ReactElement } from 'react'

import { Map, MapControls, MapMarker, MarkerContent, MarkerLabel } from '@/components/ui/map'
import { cn } from '@/utilities/ui'

import { FAIRLEND_OFFICE } from './data'

const OFFICE_CENTER = [FAIRLEND_OFFICE.longitude, FAIRLEND_OFFICE.latitude] as [number, number]

const officeMapVariants = cva('', {
  variants: {
    variant: {
      contact: 'fairlend-office-map fairlend-office-map--contact',
      ethos: 'fairlend-ethos__office-map-panel',
    },
  },
  defaultVariants: {
    variant: 'ethos',
  },
})

const officeMapClassNames = {
  contact: {
    address: 'fairlend-office-map__address',
    canvas: 'fairlend-office-map__canvas',
    controls: 'fairlend-office-map__controls',
    coordinates: 'fairlend-office-map__coordinates',
    frame: 'fairlend-office-map__frame',
    label: 'fairlend-office-map__label',
    marker: 'fairlend-office-map__marker',
    markerWrap: 'fairlend-office-map__marker-wrap',
  },
  ethos: {
    address: 'fairlend-ethos__office-address',
    canvas: 'fairlend-ethos__office-map',
    controls: 'fairlend-ethos__office-map-controls',
    coordinates: 'fairlend-ethos__office-map-coordinates',
    frame: 'fairlend-ethos__office-map-frame',
    label: 'fairlend-ethos__office-map-label',
    marker: 'fairlend-ethos__office-map-marker',
    markerWrap: 'fairlend-ethos__office-map-marker-wrap',
  },
} as const

type FairlendOfficeMapProps = VariantProps<typeof officeMapVariants> & {
  className?: string
}

export function FairlendOfficeMap({
  className,
  variant = 'ethos',
}: FairlendOfficeMapProps): ReactElement {
  const resolvedVariant = variant ?? 'ethos'
  const styles = officeMapClassNames[resolvedVariant]

  return (
    <section
      aria-label="Map showing the FairLend Toronto office"
      className={cn(officeMapVariants({ variant: resolvedVariant }), className)}
    >
      <div className={styles.frame}>
        <Map
          center={OFFICE_CENTER}
          className={styles.canvas}
          cooperativeGestures
          dragRotate={false}
          maxZoom={18}
          minZoom={11}
          pitchWithRotate={false}
          theme="dark"
          touchPitch={false}
          zoom={16}
        >
          <MapMarker
            anchor="center"
            latitude={FAIRLEND_OFFICE.latitude}
            longitude={FAIRLEND_OFFICE.longitude}
          >
            <MarkerContent className={styles.markerWrap}>
              <span aria-hidden="true" className={styles.marker}>
                FL
              </span>
              <MarkerLabel className={styles.label} position="bottom">
                FairLend / Toronto
              </MarkerLabel>
            </MarkerContent>
          </MapMarker>
          <MapControls className={styles.controls} position="top-left" showFullscreen showZoom />
        </Map>

        <p aria-hidden="true" className={styles.coordinates}>
          43.7522° N / 79.4557° W
        </p>
      </div>

      <div className={styles.address}>
        <p>Office / Toronto</p>
        <address>
          {FAIRLEND_OFFICE.addressLine}
          <br />
          {FAIRLEND_OFFICE.cityLine}
        </address>
        <a
          aria-label="Get directions to the FairLend Toronto office in Google Maps"
          href={FAIRLEND_OFFICE.directionsUrl}
          rel="noreferrer"
          target="_blank"
        >
          Directions
          <ExternalLink aria-hidden="true" size={14} strokeWidth={1.8} />
        </a>
      </div>
    </section>
  )
}
