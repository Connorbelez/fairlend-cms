// @ts-nocheck
'use client'

import React, { useState } from 'react'
import { ChevronDown, Leaf, Lightbulb, Mic, Plus, Send } from 'lucide-react'
import { motion } from 'motion/react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export type WatermelonHeroPromptProps = {
  className?: string
  depthLabel?: string | null
  links?: Page['hero']['links']
  modeLabel?: string | null
  promptPlaceholder?: string | null
  richText?: Page['hero']['richText']
  submitLabel?: string | null
  voiceLabel?: string | null
}

const defaultOptions = ['Fast', 'Balanced', 'Creative']
const defaultDepthOptions = ['Strategy', 'Underwriting', 'Exit plan']

const Hero: React.FC<WatermelonHeroPromptProps> = ({
  className,
  depthLabel = 'Strategy',
  links,
  modeLabel = 'Scenario',
  promptPlaceholder = 'Tell us about the property, timeline, and financing need...',
  richText,
  submitLabel = 'Start',
  voiceLabel = 'Talk',
}) => {
  const [normalOpen, setNormalOpen] = useState(false)
  const [deepThinkOpen, setDeepThinkOpen] = useState(false)
  const primaryLink = links?.[0]?.link

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  } as const

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  } as const

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn('relative z-50 px-4 text-center sm:px-6 lg:px-8', className)}
    >
      <div className="mx-auto max-w-5xl pt-16 sm:pt-24">
        {richText ? (
          <motion.div variants={itemVariants}>
            <RichText
              className="mx-auto max-w-none text-center text-neutral-50 [&_h1]:mx-auto [&_h1]:max-w-4xl [&_h1]:bg-gradient-to-br [&_h1]:from-orange-500 [&_h1]:to-indigo-500 [&_h1]:bg-clip-text [&_h1]:text-4xl [&_h1]:leading-tight [&_h1]:font-bold [&_h1]:text-transparent [&_h1]:sm:text-5xl [&_h1]:md:text-6xl [&_h2]:mx-auto [&_h2]:max-w-4xl [&_h2]:bg-gradient-to-br [&_h2]:from-orange-500 [&_h2]:to-indigo-500 [&_h2]:bg-clip-text [&_h2]:text-4xl [&_h2]:leading-tight [&_h2]:font-bold [&_h2]:text-transparent [&_h2]:sm:text-5xl [&_h2]:md:text-6xl [&_p]:mx-auto [&_p]:mt-4 [&_p]:max-w-3xl [&_p]:text-base [&_p]:leading-7 [&_p]:text-[#A1A7A4] [&_p]:sm:text-lg [&_p]:md:text-2xl"
              data={richText}
              enableGutter={false}
              enableProse={false}
            />
          </motion.div>
        ) : (
          <>
            <motion.h1
              variants={itemVariants}
              id="heading"
              className="inline-block bg-gradient-to-br from-orange-500 to-indigo-500 bg-clip-text text-4xl leading-tight font-bold text-transparent sm:text-5xl md:text-6xl"
              style={{ WebkitTextFillColor: 'transparent' }}
            >
              Find the right capital path for your property
            </motion.h1>
            <motion.p
              id="subheading"
              variants={itemVariants}
              className="mx-auto mt-4 max-w-3xl px-2 text-base leading-7 text-[#A1A7A4] sm:px-0 sm:text-lg md:text-2xl"
            >
              Model construction, acquisition, land, and private mortgage scenarios with a
              specialist.
            </motion.p>
          </>
        )}
      </div>

      <div className="relative overflow-visible pt-20 sm:py-24 lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-[360px] -translate-y-1/2 opacity-70 blur-3xl"
          style={{
            background:
              'linear-gradient(90deg, rgba(234,88,12,0.22), rgba(79,70,229,0.25) 52%, rgba(17,18,22,0))',
          }}
        />

        <motion.div
          variants={itemVariants}
          className="relative z-10 mx-auto max-w-full rounded-lg border border-neutral-600 bg-[#111216] p-4 backdrop-blur sm:max-w-2xl sm:p-4 sm:py-2 lg:max-w-3xl"
        >
          <div className="text-left text-lg px-2 sm:px-4">
            <input
              aria-label="Financing scenario prompt"
              type="text"
              placeholder={promptPlaceholder || undefined}
              readOnly
              className="w-full border-none bg-transparent py-3 text-sm text-white outline-none sm:py-4 sm:text-lg"
            />
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-4 p-2 sm:mt-9 sm:flex-row sm:gap-3">
            <div className="relative flex flex-wrap items-center gap-2">
              <button
                aria-label="Add financing detail"
                className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-neutral-700 bg-[#1a1b1e] text-neutral-300 hover:bg-neutral-800 sm:size-12"
                type="button"
              >
                <Plus aria-hidden />
              </button>

              <div className="relative">
                <button
                  onClick={() => setNormalOpen(!normalOpen)}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-neutral-700 bg-[#1a1b1e] px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 sm:text-base"
                  type="button"
                >
                  <Leaf aria-hidden />
                  <span>{modeLabel}</span>
                  <ChevronDown
                    aria-hidden
                    className={cn('ml-1 transition-transform', normalOpen && 'rotate-180')}
                  />
                </button>
                {normalOpen && (
                  <div className="absolute right-0 mt-2 w-fit rounded-lg border border-neutral-700 bg-[#1a1b1e] text-left shadow-lg">
                    <ul className="text-neutral-300 text-sm">
                      {defaultOptions.map((option) => (
                        <li className="cursor-pointer px-4 py-2 hover:bg-neutral-800" key={option}>
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setDeepThinkOpen(!deepThinkOpen)}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-neutral-700 bg-[#1a1b1e] px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 sm:text-lg"
                  type="button"
                >
                  <Lightbulb aria-hidden />
                  <span>{depthLabel}</span>
                  <ChevronDown
                    aria-hidden
                    className={cn('ml-1 transition-transform', deepThinkOpen && 'rotate-180')}
                  />
                </button>
                {deepThinkOpen && (
                  <div className="absolute right-0 mt-2 w-fit rounded-lg border border-neutral-700 bg-[#1a1b1e] text-left shadow-lg">
                    <ul className="text-sm text-neutral-300">
                      {defaultDepthOptions.map((option) => (
                        <li className="cursor-pointer px-4 py-2 hover:bg-neutral-800" key={option}>
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="flex cursor-pointer items-center gap-2 rounded-full border border-neutral-700 bg-[#1a1b1e] px-3 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 sm:text-base"
                type="button"
              >
                <Mic aria-hidden />
                <span className="hidden sm:block">{voiceLabel}</span>
              </button>

              {primaryLink ? (
                <CMSLink
                  {...primaryLink}
                  appearance={primaryLink.appearance || 'default'}
                  className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 p-0 text-white shadow-lg sm:size-14"
                  label={undefined}
                  preserveLinkHitArea
                >
                  <Send aria-hidden />
                  <span className="sr-only">{primaryLink.label || submitLabel}</span>
                </CMSLink>
              ) : (
                <motion.button
                  aria-label={submitLabel || 'Submit'}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0px 0px 20px rgba(236, 72, 153, 0.6)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-lg sm:size-14"
                  type="button"
                >
                  <Send aria-hidden />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Hero
