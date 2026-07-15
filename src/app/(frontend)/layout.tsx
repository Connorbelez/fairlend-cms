import type { Metadata } from 'next'

import './globals.css'
import {
  FairlendFrontendRootLayout,
  fairlendFrontendMetadata,
} from '../FairlendFrontendRootLayout'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <FairlendFrontendRootLayout>{children}</FairlendFrontendRootLayout>
}

export const metadata: Metadata = fairlendFrontendMetadata
