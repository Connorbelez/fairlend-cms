import { type ReactElement } from 'react'
import { Route } from 'lucide-react'

import { processSteps } from './data'

export function ExitRoute(): ReactElement {
  return (
    <section className="pm-route" aria-labelledby="pm-route-title">
      <header className="pm-route__header">
        <p className="pm-label">Underwrite backward from maturity</p>
        <h2 id="pm-route-title">You should know the next move before you commit.</h2>
        <p>
          If the structure does not fit, you should know early. If it does fit, the path from review
          to commitment should make the cost, conditions, and exit visible.
        </p>
      </header>

      <div className="pm-route__map">
        <svg aria-hidden="true" viewBox="0 0 1200 620">
          <path
            className="pm-route__track"
            d="M70 92 C250 62 264 260 465 232 S682 84 820 177 S974 450 1135 505"
          />
          <path
            className="pm-route__signal"
            d="M70 92 C250 62 264 260 465 232 S682 84 820 177 S974 450 1135 505"
            pathLength="1"
          />
        </svg>
        <ol>
          {processSteps.map((step, index) => (
            <li key={step.title}>
              <span className="pm-route__node">{String(index + 1).padStart(2, '0')}</span>
              <p className="pm-micro">{step.phase}</p>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="pm-route__exit-stamp">
          <Route aria-hidden="true" />
          <span>Exit first</span>
          <strong>Refinance · sale · renewal · stabilization</strong>
        </div>
      </div>
      <p className="pm-route__close">
        Start with the free review. A commitment only follows a structure that can be explained.
      </p>
    </section>
  )
}
