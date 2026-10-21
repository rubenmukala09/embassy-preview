// Ad-hoc shot script against the local python server. Mirrors shot-live.mjs
// but points at http://localhost:5200/embassy-preview/ so we can QA pending
// CSS changes before they deploy.
import { mkdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { resolve, join } from 'node:path'

const BASE = 'http://localhost:5200/embassy-preview/'
const OUT = fileURLToPath(new URL('../shots/', import.meta.url))
mkdirSync(OUT, { recursive: true })

const playwrightPath = resolve('C:/Users/malob/Desktop/ocean-descent/node_modules/playwright/index.mjs')
const playwright = await import(pathToFileURL(playwrightPath).href)
const chromium = playwright.chromium

const browser = await chromium.launch()
async function shoot(name, path, { fullPage = true, width = 1440, height = 900, hover } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  if (hover) {
    const el = await page.$(hover)
    if (el) { await el.hover(); await page.waitForTimeout(400) }
  }
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage })
  await ctx.close()
  console.log(`shot: ${name}`)
}

try {
  await shoot('local-home-full', '', { fullPage: true })
  await shoot('local-home-paths-hover', '', { fullPage: false, hover: '.home-path' })
  await shoot('local-home-leader-hover', '', { fullPage: false, hover: '.home-leader' })
  await shoot('local-consular', 'consular-services.html', { fullPage: true })
  console.log('done')
} finally {
  await browser.close()
}
