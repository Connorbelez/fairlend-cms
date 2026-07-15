import { buildLlmsFullTxt, llmsTextResponseInit } from '@/lib/fairlend-llms'

export const dynamic = 'force-static'

export function GET() {
  return new Response(buildLlmsFullTxt(), llmsTextResponseInit)
}
