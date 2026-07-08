// @ts-nocheck
'use client'

import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

type WatermelonHeroNavItem = {
  href: string
  label: string
}

export type WatermelonHeroHeaderProps = {
  brandName?: string
  navItems?: WatermelonHeroNavItem[]
  profileEmail?: string
  profileInitials?: string
  profileName?: string
}

const defaultNavItems: WatermelonHeroNavItem[] = [
  { href: '#', label: 'Community' },
  { href: '#', label: 'Pricing' },
  { href: '#', label: 'Enterprise' },
  { href: '#', label: 'Learn' },
]

const UserProfile: React.FC<
  Pick<WatermelonHeroHeaderProps, 'profileEmail' | 'profileInitials' | 'profileName'>
> = ({ profileEmail = 'hello@fairlend.ca', profileInitials = 'FL', profileName = 'Fairlend' }) => (
  <div className="flex items-center gap-3">
    <div className="flex size-10 items-center justify-center rounded-lg bg-[#9A6F6F] font-semibold">
      {profileInitials}
    </div>
    <div>
      <p className="text-sm font-medium">{profileName}</p>
      <p className="text-xs">{profileEmail}</p>
    </div>
  </div>
)

const Header: React.FC<WatermelonHeroHeaderProps> = ({
  brandName = 'Fairlend',
  navItems = defaultNavItems,
  profileEmail,
  profileInitials,
  profileName,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuContainerVariants = {
    hidden: {
      y: '-100%',
      opacity: 0,
      transition: { type: 'tween', duration: 0.3, ease: 'easeIn' },
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'tween', duration: 0.3, ease: 'easeOut', staggerChildren: 0.1 },
    },
  } as const

  const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  } as const

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-[65] flex items-center justify-between px-7 py-4 md:px-20"
      >
        <div className="flex items-center justify-start gap-16">
          <div id="logo" className="text-[34px] font-semibold">
            {brandName}
          </div>
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <a href={item.href} className="text-lg font-normal" key={item.label}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="hidden md:block">
          <UserProfile
            profileEmail={profileEmail}
            profileInitials={profileInitials}
            profileName={profileName}
          />
        </div>

        <div className="md:hidden">
          <button
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
          >
            {isMenuOpen ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuContainerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed left-0 top-0 z-[60] flex h-auto w-full flex-col items-center gap-6 border-b border-neutral-800 bg-[#111216] py-8"
            style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
          >
            <div className="pt-16">
              {navItems.map((item) => (
                <motion.a
                  className="block py-2 text-center text-xl font-normal"
                  href={item.href}
                  key={item.label}
                  onClick={() => setIsMenuOpen(false)}
                  variants={menuItemVariants}
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.div
                variants={menuItemVariants}
                className="mt-4 flex w-full justify-center border-t-[0.2px] border-gray-400/20 pt-6"
              >
                <UserProfile
                  profileEmail={profileEmail}
                  profileInitials={profileInitials}
                  profileName={profileName}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
