import { AudienceMix } from './audience-mix'
import { BrowserShare } from './browser-share'
import { OnlineNow } from './online-now'
import { TopCountries } from './top-countries'
import { TopPages } from './top-pages'
import { TopReferrers } from './top-referrers'
import { TrafficSourcesChart } from './traffic-sources-chart'
import { VisitorsChart } from './visitors-chart'
import { WebVitals } from './web-vitals'

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <VisitorsChart />
      <OnlineNow />
      <TopPages />
      <TopCountries />
      <TrafficSourcesChart />
      <AudienceMix />
      <BrowserShare />
      <TopReferrers />
      <WebVitals />
    </div>
  )
}
