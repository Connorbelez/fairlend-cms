import Image from 'next/image'
import type { ReactElement } from 'react'

import { FairlendPaperSection, FairlendPaperShell } from '@/components/FairlendMarketingPrimitives'
import { BackgroundImageTexture } from '@/components/ui/bg-image-texture'

import './ethos-section.css'

const officeAsset = '/assets/fairlend-ethos/office-sign-placeholder.webp'
const skylineAsset = '/assets/fairlend-route-selector/investor-skyline-engraving.webp'
const multiplexAsset = '/assets/fairlend-build-property-types/multiplex-building-engraving.webp'
const gardenSuiteAsset = '/assets/about-webp/webp/finance-icon-garden-suites.webp'

const alignedInterests = [
  {
    audience: 'Borrowers',
    code: '01',
    copy: 'Borrowers get clear terms, a realistic exit, and financing that solves the problem without creating a larger one.',
  },
  {
    audience: 'Investors',
    code: '02',
    copy: 'Investors get disciplined underwriting, transparent information, and professionally administered mortgage-backed opportunities.',
  },
  {
    audience: 'Builders',
    code: '03',
    copy: 'Builders get capital structured around how projects are actually built.',
  },
  {
    audience: 'FairLend',
    code: '04',
    copy: 'FairLend earns relationships that last beyond a single transaction.',
  },
] as const

export function FairlendEthosSection(): ReactElement {
  return (
    <FairlendPaperSection
      aria-labelledby="fairlend-ethos-title"
      className="fairlend-ethos"
      data-testid="fairlend-ethos-section"
      id="ethos"
    >
      <BackgroundImageTexture
        className="fairlend-ethos__texture"
        opacity={0.2}
        variant="groovepaper"
      />

      <FairlendPaperShell className="fairlend-ethos__shell">
        <header className="fairlend-ethos__proof-wall">
          <div className="fairlend-ethos__proof-photo">
            <Image
              alt="FairLend Toronto office exterior with the company sign above the entrance"
              className="fairlend-ethos__proof-image"
              fill
              loading="lazy"
              sizes="(max-width: 760px) 100vw, 92vw"
              src={officeAsset}
            />
            <span aria-hidden="true" className="fairlend-ethos__proof-screen" />
            <p className="fairlend-ethos__proof-index">FL–ETHOS / TORONTO / 001</p>
          </div>

          <div className="fairlend-ethos__proof-title">
            <p className="fairlend-ethos__eyebrow">Our Ethos</p>
            <h2
              aria-label="The name on the sign is the standard inside."
              id="fairlend-ethos-title"
            >
              <span>The name on</span>
              <span>the sign is the</span>
              <span>standard inside.</span>
            </h2>
          </div>

          <div className="fairlend-ethos__proof-thesis">
            <p>
              FairLend was built around a straightforward belief: fair lending is not only good for
              society. It is good business.
            </p>
            <p className="fairlend-ethos__office-caption">
              The FairLend office in Toronto — our name on the wall and our team accountable for
              the standard behind it.
            </p>
          </div>
        </header>

        <section
          aria-labelledby="fairlend-ethos-alignment-title"
          className="fairlend-ethos__alignment"
        >
          <div className="fairlend-ethos__alignment-sticky">
            <p className="fairlend-ethos__section-code">01 / Aligned interests</p>
            <h3 id="fairlend-ethos-alignment-title">
              The strongest mortgages align the interests of everyone involved.
            </h3>
            <p className="fairlend-ethos__alignment-note">Fair lending is good business.</p>
          </div>

          <div className="fairlend-ethos__interest-sequence" aria-label="Aligned interests">
            {alignedInterests.map((item) => (
              <article className="fairlend-ethos__interest-scene" key={item.audience}>
                <p className="fairlend-ethos__interest-code">{item.code}</p>
                <p className="fairlend-ethos__interest-audience">{item.audience}</p>
                <p className="fairlend-ethos__interest-copy">{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="fairlend-ethos__anti-predatory">
          <p className="fairlend-ethos__anti-label">How we operate</p>
          <p className="fairlend-ethos__anti-statement">
            That is why we do not believe in hidden charges or predatory fees that profit from a
            borrower’s moment of need.
          </p>
          <p className="fairlend-ethos__anti-relationship">
            We want borrowers to return because we treated them fairly—and, one day, to trust us
            when they have capital of their own to lend.
          </p>
          <div aria-hidden="true" className="fairlend-ethos__anti-stamp">
            <span>No hidden charges</span>
            <span>No predatory fees</span>
          </div>
        </section>

        <section
          aria-labelledby="fairlend-ethos-housing-title"
          className="fairlend-ethos__housing"
        >
          <div className="fairlend-ethos__trap-scene">
            <div className="fairlend-ethos__trap-copy">
              <p className="fairlend-ethos__section-code fairlend-ethos__section-code--inverse">
                02 / Capital traps
              </p>
              <h3 id="fairlend-ethos-housing-title">
                The same alignment can change what gets built.
              </h3>
              <p>
                Too much private capital is directed toward investor-first condominiums that are
                too small for families, or luxury single-family projects whose economics no longer
                work.
              </p>
            </div>
            <div className="fairlend-ethos__trap-skyline" aria-hidden="true">
              <Image alt="" fill loading="lazy" sizes="(max-width: 760px) 100vw, 58vw" src={skylineAsset} />
            </div>
            <p aria-hidden="true" className="fairlend-ethos__trap-word">
              TRAPS
            </p>
          </div>

          <div className="fairlend-ethos__build-scene">
            <div className="fairlend-ethos__build-heading">
              <p className="fairlend-ethos__section-code">03 / Capital that builds</p>
              <p className="fairlend-ethos__build-proposition">
                We see a better opportunity in medium-density housing: multiplexes, garden suites,
                laneway suites, and purpose-built rentals designed to be attainable, sustainable,
                spacious, and good enough to raise a family in.
              </p>
            </div>

            <div className="fairlend-ethos__housing-stage" aria-hidden="true">
              <figure className="fairlend-ethos__housing-asset fairlend-ethos__housing-asset--multiplex">
                <Image alt="" fill loading="lazy" sizes="(max-width: 760px) 90vw, 56vw" src={multiplexAsset} />
                <figcaption>Multiplexes / Purpose-built rental</figcaption>
              </figure>
              <figure className="fairlend-ethos__housing-asset fairlend-ethos__housing-asset--garden">
                <Image alt="" fill loading="lazy" sizes="(max-width: 760px) 58vw, 26vw" src={gardenSuiteAsset} />
                <figcaption>Garden &amp; laneway suites</figcaption>
              </figure>
              <p className="fairlend-ethos__housing-stage-label">Homes people can live in.</p>
            </div>

            <div className="fairlend-ethos__build-economics">
              <p>
                When these projects are properly selected, underwritten, and financed, private
                investors can pursue attractive returns while helping capable builders create homes
                ordinary Canadians actually need. Social value and commercial value do not have to
                compete. With the right incentives, each makes the other stronger.
              </p>
            </div>
          </div>
        </section>

        <footer className="fairlend-ethos__manifesto">
          <p className="fairlend-ethos__manifesto-kicker">The FairLend standard</p>
          <blockquote>
            Fair lending is not charity. It is an operating model built around shared success.
          </blockquote>
          <p className="fairlend-ethos__vision">
            Our vision is to point private capital toward better outcomes: strong mortgages, repeat
            relationships, attractive opportunities for investors, and more homes Canadians can
            afford to live—and raise a family—in.
          </p>
        </footer>
      </FairlendPaperShell>
    </FairlendPaperSection>
  )
}
