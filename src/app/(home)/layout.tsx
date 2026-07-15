import type { Metadata } from 'next'

import './home.css'
import {
  FairlendFrontendRootLayout,
  fairlendFrontendMetadata,
} from '../FairlendFrontendRootLayout'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <FairlendFrontendRootLayout deferFooter>{children}</FairlendFrontendRootLayout>
}

export const metadata: Metadata = fairlendFrontendMetadata
