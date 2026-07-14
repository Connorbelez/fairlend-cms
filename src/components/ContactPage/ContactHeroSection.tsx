import Image from 'next/image'
import Link from 'next/link'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import { ContactForm } from './ContactForm.client'
import { ContactMethodList } from './ContactMethodList'

const intakeStages = ['Receive', 'Route', 'Respond'] as const

export function ContactHeroSection() {
  return (
    <section aria-labelledby="contact-page-title" className="contact-hero">
      <div className="contact-hero__intro">
        <Breadcrumb className="contact-breadcrumb">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Contact</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="contact-hero__lead">
          <p className="contact-kicker">Ontario mortgage desk</p>
          <h1 id="contact-page-title">Bring us the file. We’ll make the next move clear.</h1>
          <p className="contact-hero__summary">
            Tell us the property, capital need, and deadline. We’ll route the facts to the right
            mortgage, construction, or investment conversation—without making you start over.
          </p>
        </div>

        <ContactMethodList />
      </div>

      <div className="contact-hero__intake">
        <Image
          alt=""
          aria-hidden="true"
          className="contact-hero__engraving"
          height={1024}
          sizes="(max-width: 767px) 75vw, (max-width: 1023px) 55vw, (max-width: 1279px) 42vw, 28vw"
          src="/assets/fairlend-faq-reference/toronto-landmark-engraving.webp"
          width={687}
        />
        <div className="contact-hero__intake-inner">
          <ol
            aria-label="What happens after you contact FairLend"
            className="contact-intake-stages"
          >
            {intakeStages.map((stage, index) => (
              <li className={index === 0 ? 'is-current' : undefined} key={stage}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {stage}
              </li>
            ))}
          </ol>

          <div className="contact-hero__form-heading">
            <div>
              <p className="contact-kicker contact-kicker--inverse">File intake</p>
              <h2>Send the essentials.</h2>
            </div>
            <span aria-hidden="true">CONTACT / ON</span>
          </div>
          <p className="contact-hero__form-copy">
            Include the property type, municipality, requested amount, timing, and main constraint.
            Do not send SINs, banking credentials, or identity documents here.
          </p>

          <ContactForm />

          <p className="contact-hero__consent">
            By sending this form, you consent to FairLend contacting you about your inquiry. See our{' '}
            <Link href="/en/brokerage/privacy-policy">Privacy Policy</Link> and{' '}
            <Link href="/terms">Website Terms</Link>.
          </p>
        </div>
      </div>
    </section>
  )
}
