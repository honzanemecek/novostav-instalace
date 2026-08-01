'use client'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useLocale } from '@/shared/components/LocaleProvider'
import { localizeHref } from '@/shared/utils/locale'
import { useRouter } from 'next/navigation'

export const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const router = useRouter()
  const locale = useLocale()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    router.push(localizeHref(`/search${debouncedValue ? `?q=${debouncedValue}` : ''}`, locale))
  }, [debouncedValue, router, locale])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder="Search"
        />
        <button type="submit" className="sr-only">
          submit
        </button>
      </form>
    </div>
  )
}
