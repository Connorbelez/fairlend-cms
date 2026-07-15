import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import type { ContactPathway } from './data'

type ContactPathwayLinkProps = {
  index: number
  pathway: ContactPathway
}

export function ContactPathwayLink({ index, pathway }: ContactPathwayLinkProps) {
  return (
    <Link className="contact-pathway" href={pathway.href}>
      <span className="contact-pathway__index" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="contact-pathway__body">
        <span className="contact-pathway__code">{pathway.code}</span>
        <h3 className="contact-pathway__title">{pathway.label}</h3>
        <span className="contact-pathway__description">{pathway.description}</span>
      </span>
      <span className="contact-pathway__action">
        <span>Explore</span>
        <ArrowUpRight aria-hidden="true" />
      </span>
    </Link>
  )
}
