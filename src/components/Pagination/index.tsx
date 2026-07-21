import { ArrowLeft, ArrowRight, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { cn } from '@/utilities/ui'

const pageHref = (page: number) => (page <= 1 ? '/posts' : `/posts/page/${page}`)

export const Pagination: React.FC<{
  className?: string
  page: number
  totalPages: number
}> = ({ className, page, totalPages }) => {
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1
  const pageNumbers = [page - 1, page, page + 1].filter(
    (pageNumber) => pageNumber >= 1 && pageNumber <= totalPages,
  )

  const directionClassName =
    'inline-flex min-h-12 items-center gap-2 px-3 text-sm font-extrabold text-[#18352f] underline decoration-[#96ec18] decoration-2 underline-offset-4 transition-colors hover:text-[#315a12] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#08090a] sm:px-5'

  return (
    <nav
      aria-label="Resource archive pages"
      className={cn('border-y border-[#08090a] bg-[#fffdf9]', className)}
    >
      <div className="grid min-h-20 grid-cols-[1fr_auto_1fr] items-center">
        <div className="justify-self-start">
          {hasPrevPage ? (
            <Link className={directionClassName} href={pageHref(page - 1)} rel="prev">
              <ArrowLeft aria-hidden="true" className="size-4" />
              <span className="hidden sm:inline">Previous files</span>
              <span className="sm:hidden">Previous</span>
            </Link>
          ) : (
            <span className="inline-flex min-h-12 items-center px-3 text-sm font-bold text-[#6c6c64] sm:px-5">
              First file
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 border-x border-[#deded8] px-2 sm:px-4">
          {pageNumbers[0] && pageNumbers[0] > 1 ? (
            <MoreHorizontal
              key="previous-ellipsis"
              aria-hidden="true"
              className="mx-1 size-4 text-[#6c6c64]"
            />
          ) : null}
          {pageNumbers.map((pageNumber) => {
            const isCurrent = pageNumber === page
            return (
              <Link
                key={pageNumber}
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={`Page ${pageNumber}`}
                className={cn(
                  'grid size-11 place-items-center font-[family-name:var(--font-oxanium)] text-xs font-extrabold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08090a]',
                  isCurrent
                    ? 'bg-[#08090a] text-[#96ec18]'
                    : 'text-[#494944] hover:bg-[#eef8df] hover:text-[#18352f]',
                )}
                href={pageHref(pageNumber)}
              >
                {String(pageNumber).padStart(2, '0')}
              </Link>
            )
          })}
          {pageNumbers.at(-1) && pageNumbers.at(-1)! < totalPages ? (
            <MoreHorizontal
              key="next-ellipsis"
              aria-hidden="true"
              className="mx-1 size-4 text-[#6c6c64]"
            />
          ) : null}
        </div>

        <div className="justify-self-end">
          {hasNextPage ? (
            <Link className={directionClassName} href={pageHref(page + 1)} rel="next">
              <span className="hidden sm:inline">Next files</span>
              <span className="sm:hidden">Next</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          ) : (
            <span className="inline-flex min-h-12 items-center px-3 text-sm font-bold text-[#6c6c64] sm:px-5">
              Latest file
            </span>
          )}
        </div>
      </div>
      <p className="sr-only">
        Page {page} of {totalPages}
      </p>
    </nav>
  )
}
