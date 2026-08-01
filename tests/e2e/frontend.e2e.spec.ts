import { test, expect, Page } from '@playwright/test'
import { siteConfig } from '@/shared/config/site'

// Escape regex metacharacters so a future site name (rewritten by the
// /setup skill) can't accidentally be interpreted as a pattern.
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can load homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(new RegExp(escapeRegExp(siteConfig.name)))
    const heading = page.locator('h1').first()
    await expect(heading).toHaveText(siteConfig.name)
  })

  test('serves English locale under /en', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/en')
    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(new RegExp(escapeRegExp(siteConfig.name)))
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()
  })

  test('deep unknown /en path still 404s', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/en/this-page-does-not-exist')
    expect(response?.status()).toBe(404)
  })
})
