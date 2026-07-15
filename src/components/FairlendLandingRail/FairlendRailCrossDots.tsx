const dotPositions = [
  { className: 'fairlend-landing-rail-dot--top fairlend-landing-rail-dot--left', key: 'top-left' },
  {
    className: 'fairlend-landing-rail-dot--top fairlend-landing-rail-dot--right',
    key: 'top-right',
  },
  {
    className: 'fairlend-landing-rail-dot--bottom fairlend-landing-rail-dot--left',
    key: 'bottom-left',
  },
  {
    className: 'fairlend-landing-rail-dot--bottom fairlend-landing-rail-dot--right',
    key: 'bottom-right',
  },
] as const

export function FairlendRailCrossDots() {
  return (
    <div aria-hidden="true" className="fairlend-landing-rail-dots">
      {dotPositions.map(({ className, key }) => (
        <span className={`fairlend-landing-rail-dot ${className}`} key={key} />
      ))}
    </div>
  )
}
