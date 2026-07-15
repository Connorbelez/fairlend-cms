import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getCalculator } from '@/calculators/catalog'
import { calculate, defaultInputs } from '@/calculators/engine'
import { CalculatorWorkbench } from '@/components/Calculators/CalculatorWorkbench.client'
import { buildFairlendMetadata } from '@/utilities/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const calculator = getCalculator(slug)
  if (!calculator) return {}
  return buildFairlendMetadata({
    description: calculator.description,
    path: `/calculators/${calculator.slug}`,
    title: `${calculator.title} | FairLend`,
  })
}

export default async function CalculatorPage({ params }: Props) {
  const { slug } = await params
  const calculator = getCalculator(slug)
  if (!calculator) notFound()
  const initialInputs = defaultInputs(calculator)
  const initialResult = calculate(calculator, initialInputs)
  return <CalculatorWorkbench definition={calculator} initialInputs={initialInputs} initialResult={initialResult} />
}
