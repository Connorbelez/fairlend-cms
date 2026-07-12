'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import { ArrowRight, Minus, Plus } from 'lucide-react'
import { curveCatmullRom, line } from 'd3-shape'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/utilities/ui'

import { fairlendFaqDefaultItemId, fairlendFaqGroups, type FairlendFaqGroup } from './data'

type RoutePathPoint = {
  x: number
  y: number
}

type RoutePathState = {
  body: string
  exit: string
  lead: string
}

const emptyRoutePath: RoutePathState = {
  body: '',
  exit: '',
  lead: '',
}

const visualRouteNumberByGroupId: Record<string, string> = {
  borrowers: '01',
  investors: '02',
  builders: '03',
  partners: '04',
}

const routeStopLayout: Record<
  string,
  {
    contentLeft: string
    markerLeft: string
    panelLeft: string
    rowGap: string
  }
> = {
  borrowers: {
    contentLeft: '59%',
    markerLeft: '56%',
    panelLeft: '59%',
    rowGap: '241px',
  },
  investors: {
    contentLeft: '23%',
    markerLeft: '19%',
    panelLeft: '23%',
    rowGap: '206px',
  },
  builders: {
    contentLeft: '27%',
    markerLeft: '22%',
    panelLeft: '27%',
    rowGap: '40px',
  },
  partners: {
    contentLeft: '39%',
    markerLeft: '34%',
    panelLeft: '39%',
    rowGap: '128px',
  },
}

function getGroupByItemId(itemId: string | undefined): FairlendFaqGroup | undefined {
  return fairlendFaqGroups.find((group) => group.items.some((item) => item.id === itemId))
}

function getRouteStyle(groupId: string): CSSProperties {
  const layout = routeStopLayout[groupId] ?? routeStopLayout.borrowers

  return {
    '--faq-route-content-left': layout.contentLeft,
    '--faq-route-marker-left': layout.markerLeft,
    '--faq-route-panel-left': layout.panelLeft,
    '--faq-route-row-gap': layout.rowGap,
  } as CSSProperties
}

function routeNumber(index: number): string {
  return String(index + 1).padStart(2, '0')
}

function getVisualRouteNumber(group: FairlendFaqGroup, index: number): string {
  return visualRouteNumberByGroupId[group.id] ?? routeNumber(index)
}

function svgPoint(point: RoutePathPoint): string {
  return `${point.x} ${point.y}`
}

function cubicTo(
  controlStart: RoutePathPoint,
  controlEnd: RoutePathPoint,
  end: RoutePathPoint,
): string {
  return `C ${svgPoint(controlStart)} ${svgPoint(controlEnd)} ${svgPoint(end)}`
}

function buildMeasuredRoutePath({
  builder,
  first,
  investor,
  partner,
}: {
  builder: RoutePathPoint
  first: RoutePathPoint
  investor: RoutePathPoint
  partner: RoutePathPoint
}): string {
  const upperBend = {
    x: investor.x + 185,
    y: investor.y - 165,
  }
  const lowerLoop = {
    x: builder.x - 132,
    y: builder.y + 34,
  }

  return [
    `M ${svgPoint(first)}`,
    cubicTo(
      { x: first.x - 4, y: first.y + 82 },
      { x: upperBend.x + 80, y: upperBend.y - 34 },
      upperBend,
    ),
    cubicTo(
      { x: upperBend.x - 78, y: upperBend.y + 46 },
      { x: investor.x + 104, y: investor.y - 76 },
      investor,
    ),
    cubicTo(
      { x: investor.x - 86, y: investor.y + 90 },
      { x: lowerLoop.x - 56, y: lowerLoop.y - 8 },
      lowerLoop,
    ),
    cubicTo(
      { x: lowerLoop.x + 58, y: lowerLoop.y + 8 },
      { x: builder.x - 68, y: builder.y - 22 },
      builder,
    ),
    cubicTo(
      { x: builder.x + 70, y: builder.y + 22 },
      { x: partner.x - 150, y: partner.y - 48 },
      partner,
    ),
  ].join(' ')
}

function RoutePathOverlay({ path }: { path: RoutePathState }) {
  if (!path.body) return null

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-visible max-md:hidden"
      fill="none"
    >
      <defs>
        <marker
          id="fairlend-faq-route-arrow"
          markerHeight="8"
          markerWidth="8"
          orient="auto-start-reverse"
          refX="6.8"
          refY="4"
          viewBox="0 0 8 8"
        >
          <path d="M1 1.2 6.8 4 1 6.8" fill="none" stroke="#3f413c" strokeWidth="1.4" />
        </marker>
      </defs>
      {path.lead ? (
        <path
          d={path.lead}
          markerEnd="url(#fairlend-faq-route-arrow)"
          stroke="#3f413c"
          strokeDasharray="5 8"
          strokeLinecap="round"
          strokeWidth="1.45"
        />
      ) : null}
      <path d={path.body} stroke="#3f413c" strokeLinecap="round" strokeWidth="1.78" />
      {path.exit ? (
        <path
          d={path.exit}
          stroke="#3f413c"
          strokeDasharray="5 8"
          strokeLinecap="round"
          strokeWidth="1.45"
        />
      ) : null}
    </svg>
  )
}

function TopographicContourOverlay() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-[0.74] mix-blend-multiply"
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 1100 1260"
    >
      <g stroke="#cfc8ba" strokeLinecap="round" strokeWidth="0.72">
        <path d="M25 208 C176 144 318 150 462 206 C620 268 746 266 893 202 C972 168 1038 164 1098 188" opacity="0.62" />
        <path d="M0 284 C160 216 312 214 468 276 C632 340 770 328 934 252 C1010 218 1060 218 1100 234" opacity="0.48" />
        <path d="M-18 370 C130 312 272 302 420 352 C598 412 780 404 946 326 C1012 296 1062 292 1118 318" opacity="0.38" />
        <path d="M80 514 C222 452 372 456 514 530 C684 618 844 592 1034 494" opacity="0.42" />
        <path d="M-24 642 C138 588 276 610 430 690 C606 784 790 756 1000 648 C1044 626 1082 618 1118 622" opacity="0.4" />
        <path d="M38 778 C210 718 358 748 526 842 C688 932 866 908 1086 806" opacity="0.36" />
        <path d="M-10 940 C134 870 310 892 470 972 C642 1058 820 1048 1088 934" opacity="0.34" />
        <path d="M120 1124 C260 1064 430 1082 604 1148 C770 1210 926 1198 1118 1124" opacity="0.3" />
        <path d="M-10 118 C136 80 286 92 426 138 C588 192 746 188 914 128 C1008 94 1062 96 1116 120" opacity="0.36" />
        <path d="M24 448 C166 392 326 404 478 472 C646 548 806 530 1070 424" opacity="0.34" />
        <path d="M34 860 C202 806 362 824 536 904 C704 980 884 958 1114 848" opacity="0.32" />
      </g>
      <g stroke="#d8d1c4" strokeLinecap="round" strokeWidth="0.62">
        <path d="M498 -18 C532 52 612 54 652 122 C692 190 640 248 684 320 C726 390 812 378 872 438 C936 500 918 574 1004 642 C1046 674 1082 690 1120 702" opacity="0.52" />
        <path d="M538 -10 C576 44 634 76 666 132 C706 204 676 260 714 324 C758 400 834 396 890 456 C958 528 946 598 1026 662 C1060 690 1088 704 1118 712" opacity="0.44" />
        <path d="M590 -12 C632 38 670 76 694 136 C724 210 708 272 748 338 C790 408 858 420 912 478 C970 540 974 612 1042 672" opacity="0.34" />
        <path d="M736 44 C810 16 886 36 928 96 C976 166 922 224 958 294 C988 354 1058 370 1116 402" opacity="0.42" />
        <path d="M770 86 C832 62 884 78 914 126 C948 180 922 236 960 294 C996 350 1054 366 1114 390" opacity="0.35" />
        <path d="M842 136 C892 136 914 164 906 204 C896 254 934 282 982 314 C1024 342 1064 350 1118 368" opacity="0.28" />
        <path d="M618 594 C718 554 814 566 906 622 C1000 680 1056 676 1124 636" opacity="0.5" />
        <path d="M544 670 C676 608 792 632 910 694 C1008 744 1066 734 1126 694" opacity="0.42" />
        <path d="M492 748 C626 682 774 706 922 778 C1016 822 1066 810 1124 764" opacity="0.36" />
        <path d="M520 838 C666 782 808 812 940 872 C1018 906 1070 898 1120 856" opacity="0.3" />
        <path d="M80 1040 C178 980 294 990 382 1056 C478 1128 596 1122 700 1064 C804 1006 898 1010 1018 1072" opacity="0.34" />
        <path d="M40 1098 C150 1048 284 1052 386 1116 C488 1180 612 1182 730 1120 C830 1068 938 1072 1098 1132" opacity="0.28" />
        <path d="M168 1162 C268 1124 362 1134 452 1188 C562 1256 682 1250 792 1196 C904 1140 1002 1152 1116 1206" opacity="0.24" />
        <path d="M-18 520 C64 476 148 482 218 532 C296 588 370 584 460 528 C542 478 622 478 704 526" opacity="0.34" />
        <path d="M-16 566 C76 522 162 534 232 590 C310 652 394 642 484 586 C570 532 644 536 720 584" opacity="0.28" />
        <path d="M-20 716 C68 664 154 676 222 734 C298 798 386 792 470 742 C560 688 640 696 720 752" opacity="0.26" />
        <path d="M-16 806 C84 744 180 764 264 828 C350 894 442 894 534 842 C622 790 706 804 784 862" opacity="0.28" />
        <path d="M-20 886 C102 812 222 836 326 908 C434 982 542 986 656 920 C742 870 824 876 910 934" opacity="0.24" />
      </g>
      <g stroke="#d2cabd" strokeDasharray="2 7" strokeLinecap="round" strokeWidth="0.75">
        <path d="M22 626 C106 590 194 600 262 654 C344 718 436 706 522 642 C610 578 696 586 780 646" opacity="0.32" />
        <path d="M738 520 C838 484 936 506 1018 574 C1052 602 1084 612 1120 610" opacity="0.3" />
        <path d="M150 1180 C260 1152 348 1170 440 1222 C540 1278 650 1272 754 1220" opacity="0.26" />
      </g>
      <g stroke="#d6cfc2" strokeLinecap="round" strokeWidth="0.52">
        <path d="M-18 182 C112 132 248 142 392 198 C542 256 674 262 818 206 C934 160 1022 146 1122 170" opacity="0.34" />
        <path d="M-26 238 C112 184 262 188 410 246 C552 302 704 304 842 248 C954 204 1034 190 1120 210" opacity="0.28" />
        <path d="M-24 334 C118 284 260 286 408 342 C548 396 696 398 850 340 C974 292 1048 286 1124 306" opacity="0.24" />
        <path d="M36 404 C184 346 330 364 484 424 C636 484 784 476 958 398 C1026 368 1078 360 1122 370" opacity="0.3" />
        <path d="M-22 590 C98 540 226 550 356 620 C510 704 670 704 846 626 C962 576 1040 562 1122 584" opacity="0.28" />
        <path d="M-18 690 C118 638 252 660 386 736 C532 820 700 824 888 734 C986 688 1064 682 1120 704" opacity="0.24" />
        <path d="M-24 1018 C118 946 282 970 438 1046 C594 1122 746 1110 934 1020 C1018 980 1078 976 1122 994" opacity="0.25" />
        <path d="M16 1218 C132 1178 248 1190 362 1242 C486 1298 634 1302 770 1248 C890 1200 1000 1206 1120 1260" opacity="0.22" />
      </g>
      <g stroke="#d9d2c6" strokeLinecap="round" strokeWidth="0.42">
        <path d="M458 10 C530 84 538 178 604 250 C676 328 780 316 860 388 C940 460 934 558 1026 632 C1066 664 1098 682 1128 690" opacity="0.26" />
        <path d="M486 36 C546 108 562 184 630 256 C704 334 790 342 872 410 C956 480 960 570 1036 640" opacity="0.22" />
        <path d="M520 72 C576 134 590 206 650 272 C720 348 802 362 884 428 C958 488 982 572 1048 638" opacity="0.18" />
        <path d="M596 458 C704 408 830 428 932 496 C1018 554 1074 556 1124 526" opacity="0.22" />
        <path d="M552 530 C684 476 812 502 928 572 C1018 626 1078 626 1124 590" opacity="0.2" />
        <path d="M508 610 C646 546 798 582 930 652 C1026 704 1082 690 1122 650" opacity="0.18" />
        <path d="M86 978 C206 924 340 948 470 1012 C606 1080 756 1066 902 998 C1000 952 1068 950 1122 974" opacity="0.2" />
        <path d="M48 1158 C170 1108 310 1132 432 1190 C570 1254 704 1250 848 1188 C964 1138 1046 1148 1120 1190" opacity="0.18" />
      </g>
    </svg>
  )
}

function RouteRow({
  active,
  group,
  index,
  markerRef,
}: {
  active: boolean
  group: FairlendFaqGroup
  index: number
  markerRef: (node: HTMLSpanElement | null) => void
}) {
  const visualRouteNumber = getVisualRouteNumber(group, index)

  return (
    <AccordionItem
      className={cn(
        'relative border-0 md:mb-[var(--faq-route-row-gap)]',
        active ? 'md:z-30' : 'md:z-20',
      )}
      id={group.anchorId}
      style={getRouteStyle(group.id)}
      value={group.id}
    >
      <AccordionTrigger className="group relative min-h-[94px] w-full items-start py-0 text-left hover:no-underline focus-visible:outline-none [&>svg]:hidden">
        <span
          ref={markerRef}
          aria-hidden="true"
          className={cn(
            'absolute top-[-18px] left-[var(--faq-route-marker-left)] z-20 grid size-[42px] -translate-x-1/2 place-items-center rounded-full border border-[#30332e] bg-[#f7f6f1] text-[13px] leading-none font-black tracking-[-0.04em] text-[#30332e] shadow-[0_0_0_3px_rgb(247_246_241/88%)] transition-colors duration-200 group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-[#11110f] max-md:static max-md:mb-4 max-md:size-10 max-md:translate-x-0',
            active && 'border-[#30332e] bg-[#b7ff05] text-[#30332e]',
          )}
        >
          {visualRouteNumber}
        </span>
        <span className="grid w-full grid-cols-[minmax(0,1fr)_116px_48px] items-start gap-4 pl-[var(--faq-route-content-left)] pt-0 max-md:grid-cols-[minmax(0,1fr)_40px] max-md:gap-3 max-md:pl-0">
          <span className="min-w-0">
            <span className="grid grid-cols-[auto_minmax(44px,1fr)] items-center gap-5">
              <span className="font-serif text-[35px] leading-[0.92] font-medium tracking-[-0.025em] text-[#161713] max-md:text-[30px]">
                {group.label}
              </span>
              <span aria-hidden="true" className="h-px min-w-0 bg-[#d7d7d0]" />
            </span>
            <span className="mt-4 block max-w-[240px] text-[15px] leading-[1.28] font-normal text-[#5f6159] max-md:max-w-none max-md:text-[14px]">
              {group.routeLabel}
            </span>
          </span>
          <span className="pt-[19px] text-[11px] leading-none font-bold tracking-[0.15em] text-[#62645c] uppercase max-md:hidden">
            {group.questionCountLabel}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              'mt-[10px] grid size-[34px] place-items-center justify-self-end rounded-full text-[#11110f] transition-colors duration-200',
              active ? 'bg-[#b7ff05]' : 'bg-transparent',
            )}
          >
            {active ? <Minus className="size-5" strokeWidth={2.6} /> : <Plus className="size-5" />}
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="pb-0 pt-0 pl-[var(--faq-route-panel-left)] max-md:pl-0">
        <div className="relative z-20 border border-[#d7d7d0]/72 bg-[#fbfaf5]/95 py-[30px] pr-[42px] pl-[64px] shadow-[0_16px_38px_rgb(27_25_18/3%)] max-md:px-5 max-md:py-5">
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-2 max-md:gap-y-6">
            {group.items.map((item, itemIndex) => (
              <article
                className={cn(
                  'min-w-0 border-[#d7d7d0]/70',
                  itemIndex > 1 && 'md:border-t md:pt-8',
                  itemIndex > 0 && 'max-md:border-t max-md:pt-6',
                )}
                key={item.id}
              >
                <p className="m-0 max-w-[56ch] text-[15px] leading-[1.35] font-semibold tracking-[-0.01em] text-[#252620]">
                  {item.question}
                </p>
                <p className="mt-3 mb-0 max-w-[63ch] text-[14px] leading-[1.56] font-normal text-[#54564e]">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
          <a
            className="mt-7 inline-flex items-center gap-4 border-b-4 border-[#b7ff05] pb-1 text-[12px] leading-none font-bold tracking-[0.14em] text-[#42443e] uppercase transition-colors hover:text-[#5f8500] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#11110f]"
            href={`#${group.anchorId}`}
          >
            {group.id === 'investors' ? 'Investor overview' : `${group.label} overview`}
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export function FairlendFaqSectionClient() {
  const initialGroup = useMemo(
    () => getGroupByItemId(fairlendFaqDefaultItemId) ?? fairlendFaqGroups[0],
    [],
  )
  const [activeGroupId, setActiveGroupId] = useState(initialGroup.id)
  const [routePath, setRoutePath] = useState<RoutePathState>(emptyRoutePath)
  const routePlateRef = useRef<HTMLDivElement | null>(null)
  const markerRefs = useRef<Record<string, HTMLSpanElement | null>>({})

  const setMarkerRef = useCallback(
    (groupId: string) => (node: HTMLSpanElement | null) => {
      markerRefs.current[groupId] = node
    },
    [],
  )

  useEffect(() => {
    const routePlate = routePlateRef.current
    if (!routePlate) return

    const routeLine = line<RoutePathPoint>()
      .x((point) => point.x)
      .y((point) => point.y)
      .curve(curveCatmullRom.alpha(0.72))

    const measure = () => {
      const plateRect = routePlate.getBoundingClientRect()
      const points = fairlendFaqGroups
        .map((group) => markerRefs.current[group.id])
        .filter((marker): marker is HTMLSpanElement => marker != null)
        .map((marker) => {
          const rect = marker.getBoundingClientRect()

          return {
            x: rect.left + rect.width / 2 - plateRect.left,
            y: rect.top + rect.height / 2 - plateRect.top,
          }
        })
      if (points.length < fairlendFaqGroups.length || !points[1] || !points[2]) {
        setRoutePath(emptyRoutePath)
        return
      }

      const first = points[0]
      const investor = points[1]
      const builder = points[2]
      const last = points[points.length - 1]
      const lead = routeLine([
        { x: first.x + 220, y: first.y - 76 },
        { x: first.x + 106, y: first.y - 74 },
        { x: first.x + 18, y: first.y - 38 },
        first,
      ])
      const body = buildMeasuredRoutePath({
        builder,
        first,
        investor,
        partner: last,
      })
      const exit = routeLine([
        last,
        { x: last.x - 98, y: last.y + 10 },
        { x: last.x - 124, y: last.y + 42 },
      ])

      setRoutePath({
        body: body ?? '',
        exit: exit ?? '',
        lead: lead ?? '',
      })
    }

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(routePlate)
    Object.values(markerRefs.current).forEach((marker) => {
      if (marker) resizeObserver.observe(marker)
    })

    const animationFrame = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', measure)
      resizeObserver.disconnect()
    }
  }, [activeGroupId])

  return (
    <section
      aria-labelledby="fairlend-faq-title"
      className="relative z-[70] isolate min-h-[1510px] overflow-hidden border-y border-[#d7d7d0] bg-[#f7f6f1] text-[#11110f] [font-family:var(--font-inter),Arial,sans-serif] max-md:min-h-svh"
      data-testid="fairlend-faq-section"
      id="questions"
    >
      <div
        ref={routePlateRef}
        className="relative min-h-[1260px] overflow-hidden max-md:h-auto"
        data-faq-route-plate
      >
        <Image
          alt=""
          aria-hidden="true"
          className="absolute inset-0 z-0 object-cover opacity-100"
          fill
          sizes="100vw"
          src="/assets/fairlend-route-selector/topographic-paper-background.webp"
        />
        <Image
          alt=""
          aria-hidden="true"
          className="absolute inset-0 z-0 object-cover opacity-[0.48] mix-blend-multiply"
          fill
          sizes="100vw"
          src="/assets/fairlend-route-selector/topographic-paper-background.webp"
          style={{ transform: 'scale(1.28) rotate(180deg)' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_27%_43%,rgb(255_255_255/44%),transparent_31rem),linear-gradient(180deg,rgb(251_250_245/34%),rgb(248_247_245/24%))]"
        />
        <TopographicContourOverlay />

        <div className="z-10 px-[50px] pt-[68px] md:absolute md:top-0 md:left-0 max-md:relative max-md:px-5 max-md:pt-12">
          <div className="max-w-[420px]">
            <p className="m-0 text-[12px] leading-none font-black tracking-[0.12em] text-[#30332e] uppercase">
              FAQ
            </p>
            <h2
              className="mt-[25px] mb-0 max-w-[505px] text-wrap font-serif text-[64px] leading-[0.9] font-medium tracking-[-0.04em] text-[#11110f] max-md:text-[50px]"
              id="fairlend-faq-title"
            >
              Your questions. Mapped to the financing journey.
            </h2>
            <p className="mt-[43px] mb-0 max-w-[270px] text-[17px] leading-[1.42] font-medium text-[#62645c] max-md:mt-7">
              Explore common questions along the path from opportunity to completion.
            </p>
          </div>
        </div>

        <div className="absolute top-[75px] right-[36px] z-10 w-[152px] max-md:hidden">
          <p className="m-0 text-[12px] leading-none font-black tracking-[0.12em] text-[#4e524b] uppercase">
            Toronto
          </p>
          <Image
            alt=""
            aria-hidden="true"
            className="mt-6 h-[146px] w-full object-contain object-right opacity-[0.86] mix-blend-multiply"
            height={146}
            loading="eager"
            src="/assets/fairlend-faq-reference/toronto-landmark-engraving.webp"
            width={158}
          />
        </div>

        <RoutePathOverlay path={routePath} />
        <div className="relative z-10 mx-[42px] pt-[310px] pb-[120px] max-md:mx-0 max-md:mt-14 max-md:px-5 max-md:pt-0 max-md:pb-12">
          <Accordion
            collapsible={false}
            onValueChange={(value) => {
              if (value) setActiveGroupId(value)
            }}
            type="single"
            value={activeGroupId}
          >
            <div className="relative h-full max-md:grid max-md:h-auto max-md:gap-8">
              {fairlendFaqGroups.map((group, index) => (
                <RouteRow
                  active={group.id === activeGroupId}
                  group={group}
                  index={index}
                  key={group.id}
                  markerRef={setMarkerRef(group.id)}
                />
              ))}
            </div>
          </Accordion>
        </div>

        <Image
          alt=""
          aria-hidden="true"
          className="absolute bottom-[58px] left-[29px] z-10 hidden h-[132px] w-[94px] object-contain opacity-[0.9] mix-blend-multiply md:block"
          height={132}
          loading="eager"
          src="/assets/fairlend-faq-reference/surveyor-compass-engraving.webp"
          width={94}
        />
      </div>

      <div className="relative z-20 grid h-[250px] grid-cols-[minmax(260px,0.75fr)_minmax(0,1fr)_76px] items-center gap-8 border-t border-[#d7d7d0] bg-[#f7f6f1] px-[50px] max-md:h-auto max-md:grid-cols-1 max-md:px-5 max-md:py-12">
        <div>
          <p className="m-0 text-[11px] leading-none font-black tracking-[0.12em] text-[#5d6059] uppercase">
            Next section
          </p>
          <p className="mt-8 mb-0 max-w-[330px] font-serif text-[53px] leading-[0.88] font-medium tracking-[-0.045em] text-[#11110f] max-md:text-[44px]">
            Let&apos;s build what&apos;s next.
          </p>
        </div>
        <div className="h-[202px] w-full max-w-[520px] -translate-y-1 overflow-hidden justify-self-center opacity-[0.88] mix-blend-multiply max-md:justify-self-start">
          <Image
            alt=""
            aria-hidden="true"
            className="h-auto w-full"
            height={202}
            loading="eager"
            src="/assets/fairlend-faq-reference/infill-block-engraving.webp"
            width={519}
          />
        </div>
        <a
          aria-label="Go to partner section"
          className="grid size-[56px] -translate-x-2 translate-y-1 place-items-center rounded-full bg-[#b7ff05] text-[#11110f] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#11110f] max-md:justify-self-start"
          href="#leadership"
        >
          <ArrowRight aria-hidden="true" className="size-7" strokeWidth={2.4} />
        </a>
      </div>
    </section>
  )
}
