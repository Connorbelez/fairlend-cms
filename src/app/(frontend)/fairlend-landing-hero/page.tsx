import { permanentRedirect } from 'next/navigation'

import { buildFairlendMetadata } from '@/utilities/seo'

export const metadata = buildFairlendMetadata({
  description: 'Redirects to the FairLend Mortgage home page.',
  index: false,
  path: '/fairlend-landing-hero',
  title: 'FairLend Mortgage',
})

export default function FairlendLandingHeroPage() {
  permanentRedirect('/')
}
