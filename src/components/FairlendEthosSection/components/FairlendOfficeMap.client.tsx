'use client'

import { ExternalLink } from 'lucide-react'
import type { ReactElement } from 'react'

import { Map, MapControls, MapMarker, MarkerContent, MarkerLabel } from '@/components/ui/map'

import { FAIRLEND_OFFICE } from '../content'

const OFFICE_CENTER = [FAIRLEND_OFFICE.longitude, FAIRLEND_OFFICE.latitude] as [number, number]

export function FairlendOfficeMap(): ReactElement {
  return (
    <section
      aria-label="Map showing the FairLend Toronto office"
      className="fairlend-ethos__office-map-panel"
    >
      <div className="fairlend-ethos__office-map-frame">
        <Map
          center={OFFICE_CENTER}
          className="fairlend-ethos__office-map"
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
            <MarkerContent className="fairlend-ethos__office-map-marker-wrap">
              <span aria-hidden="true" className="fairlend-ethos__office-map-marker">
                FL
              </span>
              <MarkerLabel className="fairlend-ethos__office-map-label" position="bottom">
                FairLend / Toronto
              </MarkerLabel>
            </MarkerContent>
          </MapMarker>
          <MapControls
            className="fairlend-ethos__office-map-controls"
            position="top-left"
            showFullscreen
            showZoom
          />
        </Map>

        <p aria-hidden="true" className="fairlend-ethos__office-map-coordinates">
          43.7522° N / 79.4557° W
        </p>
      </div>

      <div className="fairlend-ethos__office-address">
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
