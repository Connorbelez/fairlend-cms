import Link from 'next/link'

import { JsonLd } from '@/components/SEO/JsonLd'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { buildBreadcrumbJsonLd } from '@/utilities/structuredData'

type PathItem = {
  description: string
  href: string
  title: string
}

type FairlendPathHubProps = {
  description: string
  label: string
  path: string
  paths: PathItem[]
  preparation: string[]
  title: string
}

export function FairlendPathHub({
  description,
  label,
  path,
  paths,
  preparation,
  title,
}: FairlendPathHubProps) {
  return (
    <main className="bg-[#f8f7f5] text-[#08090a]">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: label, path },
        ])}
      />
      <section className="mx-auto max-w-[86rem] px-5 pb-16 pt-7 sm:px-8 sm:pb-24 lg:px-14 lg:pb-28">
        <Breadcrumb>
          <BreadcrumbList className="text-xs text-[#6c6c64]">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{label}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(32rem,1.12fr)] lg:items-end">
          <div>
            <p className="font-[family-name:var(--font-oxanium)] text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#203500]">
              FairLend route guide
            </p>
            <h1 className="mt-6 max-w-[12ch] text-balance font-[family-name:var(--font-cormorant)] text-[clamp(3.75rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.04em]">
              {title}
            </h1>
          </div>
          <p className="max-w-2xl text-pretty text-lg font-medium leading-8 text-[#494944] lg:pb-2">
            {description}
          </p>
        </div>
      </section>

      <section className="border-y border-[#deded8] bg-[#fffdf9]">
        <div className="mx-auto max-w-[79rem] border-x border-[#deded8]">
          {paths.map((item) => (
            <Link
              className="group grid gap-5 border-b border-[#deded8] p-6 transition-colors last:border-b-0 hover:bg-[#f7f6f1] sm:p-8 md:grid-cols-[minmax(16rem,0.72fr)_minmax(0,1.28fr)_auto] md:items-center lg:p-10"
              href={item.href}
              key={item.href}
            >
              <h2 className="text-balance font-[family-name:var(--font-cormorant)] text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                {item.title}
              </h2>
              <p className="max-w-2xl text-sm font-medium leading-6 text-[#494944] sm:text-base sm:leading-7">
                {item.description}
              </p>
              <span className="flex size-11 items-center justify-center bg-[#96ec18] text-xl font-bold text-[#030405] transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[79rem] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-0">
        <div>
          <h2 className="text-balance font-[family-name:var(--font-cormorant)] text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Bring enough context for a useful first call.
          </h2>
          <p className="mt-5 max-w-lg text-base font-medium leading-7 text-[#494944]">
            You do not need a perfect package. A few concrete details help FairLend identify the
            right route and the next document to request.
          </p>
        </div>
        <ul className="border-t border-[#deded8]">
          {preparation.map((item) => (
            <li
              className="flex gap-4 border-b border-[#deded8] py-5 text-base font-semibold leading-7"
              key={item}
            >
              <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 bg-[#96ec18]" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-[#08090a] px-5 py-14 text-[#fffdf9] sm:px-8 sm:py-16 lg:px-14">
        <div className="mx-auto flex max-w-[79rem] flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-cormorant)] text-4xl font-semibold tracking-[-0.03em]">
              Not sure which path fits?
            </h2>
            <p className="mt-2 text-sm font-medium text-white/70">
              Send the property, timing, and constraint. We will route the question.
            </p>
          </div>
          <Link
            className="inline-flex min-h-11 items-center justify-center bg-[#96ec18] px-6 text-sm font-extrabold text-[#030405] transition-colors hover:bg-[#a4fb20] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#96ec18]"
            href="/contact"
          >
            Contact FairLend
          </Link>
        </div>
      </section>
    </main>
  )
}
