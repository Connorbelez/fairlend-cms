import Image from 'next/image'
import { Suspense, type ReactElement } from 'react'
import { ArrowDownRight, Check } from 'lucide-react'

import { FairlendLeadIntake } from '@/components/FairlendLeadIntake/FairlendLeadIntake.client'

export function InstitutionalCover(): ReactElement {
  return (
    <section className="im-cover" aria-labelledby="im-cover-title">
      <div className="im-cover__skyline" aria-hidden="true">
        <Image
          alt=""
          className="im-cover__skyline-image"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 72vw"
          src="/assets/fairlend/fairlend-toronto-skyline-hero-21x9.webp"
        />
      </div>
      <svg aria-hidden="true" className="im-cover__route" viewBox="0 0 1200 420">
        <path
          d="M18 334 C210 392 280 176 470 224 S690 390 836 234 S1020 96 1182 126"
          pathLength="1"
        />
      </svg>

      <div className="im-cover__copy">
        <p className="im-system-label">Institutional mortgage / Ontario</p>
        <h1 id="im-cover-title">
          The right mortgage is a <span>policy match.</span>
        </h1>
        <p className="im-cover__lede">
          FairLend organizes the complete file, screens it against institutional lender criteria,
          and helps you compare the terms that matter—not just the first rate you see.
        </p>
        <ul className="im-cover__signals" aria-label="Institutional mortgage review scope">
          <li>
            <Check aria-hidden="true" /> Banks, credit unions, trusts, and monolines
          </li>
          <li>
            <Check aria-hidden="true" /> Purchase, renewal, transfer, and refinance
          </li>
          <li>
            <Check aria-hidden="true" /> One file built for lender-ready review
          </li>
        </ul>
        <a className="im-cover__skip" href="#lender-fit">
          See how lender fit works <ArrowDownRight aria-hidden="true" />
        </a>
      </div>

      <div className="im-cover__intake" id="institutional-mortgage-intake">
        <div className="im-cover__intake-head">
          <span>Live file</span>
          <strong>Start the lender-fit review</strong>
        </div>
        <Suspense fallback={null}>
          <FairlendLeadIntake
            intentOverride="mortgage"
            mortgageProduct="institutional"
            mortgageVariant="hero"
            sourceOverride="institutional-mortgage-hero-review"
          />
        </Suspense>
      </div>
    </section>
  )
}
