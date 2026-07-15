import Image from 'next/image'

import { ContactPathwayLink } from './ContactPathwayLink'
import { contactPathways } from './data'

export function ContactPathwaysSection() {
  return (
    <section aria-labelledby="contact-pathways-title" className="contact-pathways">
      <div className="contact-pathways__story">
        <div>
          <p className="contact-kicker">Find your route</p>
          <h2 id="contact-pathways-title">Four ways we can help. One clean handoff.</h2>
          <p>
            Start with the route closest to your file. Each page explains the fit, evidence, and
            likely next step before you send an inquiry.
          </p>
        </div>

        <figure className="contact-pathways__figure">
          <Image
            alt="Engraved view of a Toronto infill housing block"
            className="contact-pathways__image"
            height={509}
            loading="lazy"
            sizes="(max-width: 767px) 185vw, (max-width: 1023px) 135vw, (max-width: 1279px) 48vw, 38vw"
            src="/assets/fairlend-faq-reference/infill-block-engraving.webp"
            width={1600}
          />
          <figcaption>
            <span>Southern Ontario</span>
            <span>Property capital routing</span>
          </figcaption>
        </figure>
      </div>

      <div className="contact-pathways__ledger" aria-label="FairLend financing options">
        {contactPathways.map((pathway, index) => (
          <ContactPathwayLink index={index} key={pathway.href} pathway={pathway} />
        ))}
      </div>
    </section>
  )
}
