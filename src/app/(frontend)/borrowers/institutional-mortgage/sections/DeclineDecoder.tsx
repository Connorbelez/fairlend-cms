import Image from 'next/image'
import type { ReactElement } from 'react'
import { CircleAlert } from 'lucide-react'

import { declineReasons } from './data'

export function DeclineDecoder(): ReactElement {
  return (
    <section className="im-decline" aria-labelledby="im-decline-title">
      <div className="im-decline__art" aria-hidden="true">
        <Image
          alt=""
          fill
          sizes="(max-width: 900px) 100vw, 46vw"
          src="/assets/fairlend-route-selector/investor-skyline-engraving.webp"
        />
      </div>
      <div className="im-decline__lead">
        <CircleAlert aria-hidden="true" />
        <h2 id="im-decline-title">A bank “no” is a finding, not a diagnosis.</h2>
        <p>
          The useful question is why the file failed. The answer determines whether another
          institution, a revised structure, more evidence, or a different financing route makes
          sense.
        </p>
      </div>
      <div className="im-decline__register">
        {declineReasons.map(({ finding, response, signal }, index) => (
          <article key={signal}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{signal}</h3>
              <p>{finding}</p>
            </div>
            <div className="im-decline__response">
              <strong>What changes</strong>
              <p>{response}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
