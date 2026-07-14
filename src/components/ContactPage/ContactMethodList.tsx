import { ArrowUpRight, Clock3, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'

const contactMethods: Array<{
  detail: string
  href?: string
  icon: LucideIcon
  label: string
}> = [
  {
    detail: '647-831-7605',
    href: 'tel:+16478317605',
    icon: Phone,
    label: 'Call FairLend',
  },
  {
    detail: 'elie@fairlend.ca',
    href: 'mailto:elie@fairlend.ca',
    icon: Mail,
    label: 'Email the capital desk',
  },
  {
    detail: 'Monday–Friday, 9:00 a.m.–5:00 p.m. ET',
    icon: Clock3,
    label: 'Consultation availability',
  },
  {
    detail: 'Ontario, focused on Toronto and the GTA',
    icon: MapPin,
    label: 'Service area',
  },
]

export function ContactMethodList() {
  return (
    <div className="contact-methods" aria-label="Direct contact options">
      {contactMethods.map(({ detail, href, icon: Icon, label }) => {
        const content = (
          <>
            <span className="contact-methods__icon" aria-hidden="true">
              <Icon />
            </span>
            <span className="contact-methods__copy">
              <span className="contact-methods__label">{label}</span>
              <span className="contact-methods__detail">{detail}</span>
            </span>
            {href ? <ArrowUpRight aria-hidden="true" className="contact-methods__arrow" /> : null}
          </>
        )

        return href ? (
          <a className="contact-methods__item" href={href} key={label}>
            {content}
          </a>
        ) : (
          <div className="contact-methods__item" key={label}>
            {content}
          </div>
        )
      })}
    </div>
  )
}
