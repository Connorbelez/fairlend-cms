import { ImageResponse } from 'next/og'

export const alt = 'FairLend Mortgage'
export const contentType = 'image/png'
export const runtime = 'edge'
export const size = {
  height: 630,
  width: 1200,
}

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'stretch',
        background: '#f8f3eb',
        color: '#062c2f',
        display: 'flex',
        fontFamily: 'Arial, sans-serif',
        height: '100%',
        justifyContent: 'space-between',
        padding: 72,
        position: 'relative',
        width: '100%',
      }}
    >
      <div
        style={{
          border: '2px solid #062c2f',
          bottom: 36,
          left: 36,
          position: 'absolute',
          right: 36,
          top: 36,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ color: '#c85d2b', fontSize: 32, fontWeight: 800, letterSpacing: 5 }}>
          FAIRLEND MORTGAGE
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 820 }}>
          <div style={{ fontSize: 82, fontWeight: 800, letterSpacing: 0, lineHeight: 0.95 }}>
            Private real estate financing, structured clearly.
          </div>
          <div style={{ color: '#33545e', fontSize: 32, fontWeight: 600, lineHeight: 1.25 }}>
            Ontario borrowers, builders, partners, and private mortgage investors.
          </div>
        </div>
        <div style={{ color: '#33545e', fontSize: 28, fontWeight: 700 }}>fairlend.ca</div>
      </div>
      <div
        style={{
          alignItems: 'center',
          background: '#062c2f',
          color: '#f8f3eb',
          display: 'flex',
          fontSize: 72,
          fontWeight: 800,
          height: 190,
          justifyContent: 'center',
          width: 190,
        }}
      >
        FL
      </div>
    </div>,
    size,
  )
}
