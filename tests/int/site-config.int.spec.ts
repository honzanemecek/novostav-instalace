import { describe, it, expect } from 'vitest'
import { siteConfig } from '@/shared/config/site'
import { mergeOpenGraph } from '@/shared/utils/mergeOpenGraph'

describe('site config', () => {
  it('exposes the placeholder identity', () => {
    expect(siteConfig.name).toBe('My Site')
    expect(siteConfig.description.cs).toBeTruthy()
    expect(siteConfig.description.en).toBeTruthy()
    expect(siteConfig.domain).toBe('example.com')
  })

  it('drives default OpenGraph metadata', () => {
    const og = mergeOpenGraph()
    expect(og?.siteName).toBe(siteConfig.name)
    expect(og?.title).toBe(siteConfig.name)
  })
})
