import * as React from 'react'

import { cn } from '@/utilities/ui'

type CardProps = React.HTMLAttributes<HTMLElement> & {
  render?: React.ReactElement
}

const Card = React.forwardRef<HTMLElement, CardProps>(({ className, render, ...props }, ref) => {
  const cardProps = {
    className: cn('bg-card text-card-foreground rounded-lg border shadow-sm', className),
    ...props,
  }

  if (React.isValidElement(render)) {
    const renderElement = render as React.ReactElement<{ className?: string }>
    const cloneProps = {
      ...cardProps,
      'data-slot': 'card',
      className: cn(renderElement.props.className, cardProps.className),
      ref,
    } as Partial<React.HTMLAttributes<HTMLElement>> & {
      'data-slot': string
      ref: React.ForwardedRef<HTMLElement>
    }

    return React.cloneElement(renderElement, cloneProps)
  }

  return (
    <div
      data-slot="card"
      className={cardProps.className}
      ref={ref as React.Ref<HTMLDivElement>}
      {...props}
    />
  )
})
Card.displayName = 'Card'

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      data-slot="card-header"
      className={cn('flex flex-col gap-1.5 p-6', className)}
      {...props}
    />
  )
}

const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => {
  return (
    <h3
      data-slot="card-title"
      className={cn('text-2xl leading-none font-semibold tracking-tight', className)}
      {...props}
    />
  )
}

const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => {
  return (
    <p
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return <div data-slot="card-content" className={cn('p-6 pt-0', className)} {...props} />
}

const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
