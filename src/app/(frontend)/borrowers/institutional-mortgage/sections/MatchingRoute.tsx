import type { ReactElement } from 'react'

import { matchSteps } from './data'

export function MatchingRoute(): ReactElement {
  return (
    <section className="im-route" aria-labelledby="im-route-title">
      <div className="im-route__lead">
        <h2 id="im-route-title">One complete file. A deliberate lender route.</h2>
        <p>
          The process narrows options before applications spread. Each stage should remove
          uncertainty and make the next decision easier to defend.
        </p>
      </div>
      <ol className="im-route__track">
        {matchSteps.map(([title, detail], index) => (
          <li key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{title}</h3>
              <p>{detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="im-route__network" aria-hidden="true">
        <div className="im-route__node im-route__node--source">FILE</div>
        <i />
        <i />
        <i />
        <div className="im-route__node im-route__node--match">FIT</div>
      </div>
    </section>
  )
}
