import { cn } from '@/utilities/ui'
import type React from 'react'
import { GithubIcon } from './icons/github-icon'
import { XIcon } from './icons/x-icon'
import { FullWidthDivider } from './full-width-divider'
import { Mail, MapPin, Phone } from 'lucide-react'

const APP_EMAIL = 'mail@example.com'
const APP_PHONE = '+92 300 1234567'
const APP_PHONE_2 = '+92 321 9876543'

export function Contact() {
  const socialLinks = [
    {
      icon: <GithubIcon className="size-3.5 text-muted-foreground" />,
      href: '#',
      label: 'GitHub',
    },
    {
      icon: <XIcon className="size-3.5 text-muted-foreground" />,
      href: '#',
      label: 'Twitter',
    },
  ]

  return (
    <div className="relative mx-auto min-h-screen max-w-5xl border-x">
      <div className="flex grow flex-col justify-center px-4 py-18 md:items-center">
        <h1 className="font-bold text-4xl md:text-5xl">Contact Us</h1>
        <p className="mb-5 text-base text-muted-foreground">Contact the support team at efferd.</p>
      </div>
      <FullWidthDivider />
      <div className="grid md:grid-cols-3">
        <Box description="We respond to all emails within 24 hours." icon={<Mail />} title="Email">
          <a
            className="font-medium font-mono text-sm tracking-wide hover:underline"
            href={`mailto:${APP_EMAIL}`}
          >
            {APP_EMAIL}
          </a>
        </Box>
        <Box description="Drop by our office for a chat." icon={<MapPin />} title="Office">
          <span className="font-medium font-mono text-sm tracking-wide">
            Office # 100, 101 Second Floor Kohinoor 1, Faisalabad, Pakistan
          </span>
        </Box>
        <Box
          className="border-b-0 md:border-r-0"
          description="We're available Mon-Fri, 9am-5pm."
          icon={<Phone />}
          title="Phone"
        >
          <div>
            <a
              className="block font-medium font-mono text-sm tracking-wide hover:underline"
              href={`tel:${APP_PHONE}`}
            >
              {APP_PHONE}
            </a>
            <a
              className="block font-medium font-mono text-sm tracking-wide hover:underline"
              href={`tel:${APP_PHONE_2}`}
            >
              {APP_PHONE_2}
            </a>
          </div>
        </Box>
      </div>
      <FullWidthDivider />
      <div className="z-1 flex h-full flex-col items-center justify-center gap-4 py-24">
        <h2 className="text-center font-medium text-2xl text-muted-foreground tracking-tight md:text-3xl">
          Find us <span className="text-foreground">online</span>
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {socialLinks.map((link) => (
            <a
              className="flex items-center gap-x-2 rounded-full border bg-card px-3 py-1.5 shadow hover:bg-accent"
              href={link.href}
              key={link.label}
              rel="noopener noreferrer"
              target="_blank"
            >
              {link.icon}
              <span className="font-medium font-mono text-xs tracking-wide">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

type ContactBox = React.ComponentProps<'div'> & {
  icon: React.ReactNode
  title: string
  description: string
}

function Box({ title, description, className, children, ...props }: ContactBox) {
  return (
    <div
      className={cn('flex flex-col justify-between border-b md:border-r md:border-b-0', className)}
    >
      <div
        className={cn(
          'flex items-center gap-x-3 border-b bg-secondary/50 p-4 dark:bg-secondary/20',
          '[&_svg]:size-5 [&_svg]:stroke-width-1 [&_svg]:text-muted-foreground',
        )}
      >
        {props.icon}
        <h2 className="font-heading font-medium text-lg tracking-wider">{title}</h2>
      </div>
      <div className="flex items-center gap-x-2 p-4 py-12">{children}</div>
      <div className="border-t p-4">
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  )
}
