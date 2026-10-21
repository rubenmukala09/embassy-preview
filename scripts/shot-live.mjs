// Capture full-page shots of the live embassy site. One-off audit tool.
import { mkdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { resolve, join } from 'node:path'

const BASE = 'https://rubenmukala09.github.io/embassy-preview/'
const OUT = fileURLToPath(new URL('../shots/', import.meta.url))
mkdirSync(OUT, { recursive: true })

const playwrightPath = resolve('C:/Users/malob/Desktop/ocean-descent/node_modules/playwright/index.mjs')
const playwright = await import(pathToFileURL(playwrightPath).href)
const chromium = playwright.chromium

const browser = await chromium.launch()
async function shoot(name, path, { fullPage = true, width = 1440, height = 900 } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1800)
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage })
  await ctx.close()
  console.log(`shot: ${name}`)
}

try {
  await shoot('live-home', '', { fullPage: false })
  await shoot('live-home-full', '', { fullPage: true })
  await shoot('live-home-mobile', '', { fullPage: true, width: 390, height: 844 })
  await shoot('live-consular', 'consular-services.html', { fullPage: true })
  await shoot('live-invest', 'invest-in-drc.html', { fullPage: true })
  console.log('done')
} finally {
  await browser.close()
}
