import { NextResponse } from 'next/server'

import { getCalculator } from '@/calculators/catalog'
import { calculate, hasFiniteNumericOutputs } from '@/calculators/engine'
import type { CalculatorInputs } from '@/calculators/types'

type Props = { params: Promise<{ slug: string }> }

export async function POST(request: Request, { params }: Props) {
  const { slug } = await params
  const definition = getCalculator(slug)
  if (!definition) return NextResponse.json({ error: 'Calculator not found.' }, { status: 404 })

  try {
    const inputs = await request.json() as CalculatorInputs
    const result = calculate(definition, inputs)
    if (!hasFiniteNumericOutputs(result)) {
      return NextResponse.json({ error: 'One or more inputs produced an undefined numeric result.' }, { status: 422 })
    }
    return NextResponse.json({ result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'This scenario could not be calculated.' },
      { status: 422 },
    )
  }
}
