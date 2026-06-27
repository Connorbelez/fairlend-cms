'use client'
import { SearchIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter } from 'next/navigation'

export const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const router = useRouter()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    router.push(`/search${debouncedValue ? `?q=${debouncedValue}` : ''}`)
  }, [debouncedValue, router])

  return (
    <div className="fairlend-search-motion">
      <form
        className="relative"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-[#486572]"
          strokeWidth={1.9}
        />
        <Input
          className="h-14 rounded-full border-[#e1d1c2] bg-[#fffaf4] pr-5 pl-13 text-[17px] font-semibold text-[#062c2f] shadow-[0_18px_46px_rgb(63_38_18/7%),inset_0_1px_0_rgb(255_252_248/86%)] placeholder:text-[#6b838b] focus-visible:ring-[#ff3a19]/16 focus-visible:outline-[#ff3a19]"
          id="search"
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder="Search lending topics, permits, construction, investors"
        />
        <button type="submit" className="sr-only">
          Submit search
        </button>
      </form>
    </div>
  )
}
