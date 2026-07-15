import { buildLlmsTxt, llmsTextResponseInit } from '@/lib/fairlend-llms'

export const dynamic = 'force-static'

export function GET() {
  return new Response(buildLlmsTxt(), llmsTextResponseInit)
}
