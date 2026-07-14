'use client'

import { motion, useReducedMotion } from 'motion/react'

export function FairlendSubmissionSuccess({ intent }: { intent: 'invest' | 'mortgage' }) {
  const shouldReduceMotion = useReducedMotion()
  const isInvestor = intent === 'invest'
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <motion.div
      animate={{ filter: 'blur(0px)', opacity: 1, scale: 1, y: 0 }}
      className="relative isolate overflow-hidden rounded-[16px] border border-[#cfd8cb] bg-[linear-gradient(145deg,rgb(255_255_255/96%),rgb(245_249_240/96%))] px-[clamp(18px,1.5vw,24px)] py-[clamp(20px,1.6vw,26px)] text-center shadow-[inset_0_1px_0_white,0_16px_36px_rgb(28_56_25/10%)]"
      initial={shouldReduceMotion ? false : { filter: 'blur(5px)', opacity: 0, scale: 0.96, y: 12 }}
      role="status"
      transition={transition}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[10%] top-0 h-px bg-[linear-gradient(90deg,transparent,#96ec18,transparent)]"
        initial={shouldReduceMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ ...transition, delay: shouldReduceMotion ? 0 : 0.08 }}
      />

      <div className="relative mx-auto mb-4 grid size-[76px] place-items-center">
        <motion.span
          aria-hidden="true"
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 rounded-full border border-[#96ec18]/50 bg-[#96ec18]/10"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.55 }}
          transition={{ ...transition, delay: shouldReduceMotion ? 0 : 0.1 }}
        />
        <motion.span
          aria-hidden="true"
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          className="absolute inset-[5px] rounded-full border border-dashed border-[#5f8e27]/45 before:absolute before:top-[-3px] before:left-1/2 before:size-[7px] before:-translate-x-1/2 before:rounded-full before:bg-[#96ec18] before:shadow-[0_0_0_4px_rgb(150_236_24/18%)] before:content-['']"
          transition={{ duration: 5, ease: 'linear', repeat: Infinity }}
        />
        <svg
          aria-hidden="true"
          className="relative size-[42px] overflow-visible"
          fill="none"
          viewBox="0 0 48 48"
        >
          <motion.circle
            animate={{ pathLength: 1, opacity: 1 }}
            className="stroke-[#193923]"
            cx="24"
            cy="24"
            initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
            r="19"
            strokeWidth="2.4"
            transition={{ duration: shouldReduceMotion ? 0 : 0.52, ease: 'easeOut' }}
          />
          <motion.path
            animate={{ pathLength: 1, opacity: 1 }}
            d="m15.5 24.5 5.6 5.7 11.8-13"
            initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
            stroke="#193923"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3.2"
            transition={{
              delay: shouldReduceMotion ? 0 : 0.38,
              duration: shouldReduceMotion ? 0 : 0.42,
            }}
          />
        </svg>
      </div>

      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#568316]"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
        transition={{ ...transition, delay: shouldReduceMotion ? 0 : 0.35 }}
      >
        {isInvestor ? 'Investor profile received' : 'Mortgage request received'}
      </motion.p>
      <motion.h3
        animate={{ opacity: 1, y: 0 }}
        className="m-0 text-balance text-[clamp(19px,1.3vw,24px)] leading-[1.08] font-extrabold text-[#071d25]"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 7 }}
        transition={{ ...transition, delay: shouldReduceMotion ? 0 : 0.43 }}
      >
        {isInvestor
          ? 'Your capital goals are in good hands.'
          : 'Your options are now under review.'}
      </motion.h3>
      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-2 max-w-[34ch] text-[clamp(12px,0.82vw,14px)] leading-[1.45] text-[#52605c]"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 7 }}
        transition={{ ...transition, delay: shouldReduceMotion ? 0 : 0.51 }}
      >
        Received. We will follow up shortly.
      </motion.p>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-4 flex max-w-[330px] items-center rounded-[10px] border border-[#dfe5da] bg-white/75 px-3 py-2.5 text-left"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 9 }}
        transition={{ ...transition, delay: shouldReduceMotion ? 0 : 0.62 }}
      >
        <span className="relative mr-3 flex size-2.5 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#96ec18] opacity-55 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2.5 rounded-full bg-[#70b811]" />
        </span>
        <span className="text-xs leading-[1.3] font-bold text-[#34423e]">
          Next: a FairLend specialist reviews your details before reaching out.
        </span>
      </motion.div>
    </motion.div>
  )
}
