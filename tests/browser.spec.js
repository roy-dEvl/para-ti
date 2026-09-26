import { test, expect } from '@playwright/test'

async function enter(page) {
  await page.goto('/')
  const button = page.getByRole('button', { name: 'ELISSS, entrar en tu universo' })
  await expect(button).toBeEnabled({ timeout: 30000 })
  await button.click()
  await expect(page.getByRole('button', { name: 'Iluminar el universo' })).toBeVisible({ timeout: 20000 })
}
test('desktop: rendering, orbit, wave, replay and optional audio', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', msg => { if (msg.type() === 'error' && /THREE|Shader|React|Uncaught/i.test(msg.text())) errors.push(msg.text()) })
  await page.setViewportSize({ width: 1920, height: 1080 })
  await enter(page)
  await page.waitForTimeout(1800)
  await page.screenshot({ path: 'test-results/desktop.png' })
  await page.mouse.move(1050, 600); await page.mouse.down(); await page.mouse.move(1200, 110, { steps: 25 }); await page.mouse.up()
  await page.waitForTimeout(900)
  await page.screenshot({ path: 'test-results/orbit.png' })
  const illuminate = page.getByRole('button', { name: 'Iluminar el universo' })
  await illuminate.click()
  await expect(page.getByRole('button', { name: 'El universo se ilumina…' })).toBeDisabled()
  await expect(page.getByText('Para ti, jefa, un pequeño universo de luz', { exact: true })).toBeVisible({ timeout: 20000 })
  await illuminate.click()
  await expect(page.getByRole('button', { name: 'El universo se ilumina…' })).toBeDisabled()
  await page.getByRole('button', { name: 'Activar música' }).click()
  await expect(page.getByText('La música aún no está disponible.', { exact: false })).toBeVisible({ timeout: 10000 })
  for (const quality of ['low', 'medium', 'high']) await page.getByLabel('Calidad gráfica').selectOption(quality)
  await page.waitForTimeout(1000)
  expect(errors).toEqual([])
})
for (const viewport of [{ width: 2560, height: 1600 }, { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 360, height: 740 }]) {
  test(`responsive ${viewport.width}x${viewport.height}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport, hasTouch: viewport.width <= 768, isMobile: viewport.width < 768, reducedMotion: 'reduce' })
    const page = await context.newPage(), errors = []
    page.on('pageerror', e => errors.push(e.message))
    await enter(page)
    const button = page.getByRole('button', { name: 'Iluminar el universo' })
    const box = await button.boundingBox()
    expect(box.x).toBeGreaterThanOrEqual(0); expect(box.y + box.height).toBeLessThanOrEqual(viewport.height)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight)).toBe(true)
    await page.screenshot({ path: `test-results/view-${viewport.width}.png` })
    if (viewport.width < 768) {
      const client = await context.newCDPSession(page)
      await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 280 }] })
      for (let y = 290; y <= 450; y += 20) await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 190, y }] })
      await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      expect(await page.evaluate(() => window.scrollY)).toBe(0)
    }
    expect(errors).toEqual([])
    await context.close()
  })
}
test('WebGL unavailable and context loss show a recovery screen', async ({ browser }) => {
  const context = await browser.newContext(), page = await context.newPage()
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (type, ...args) { return type.includes('webgl') ? null : original.call(this, type, ...args) }
  })
  await page.goto('/')
  await expect(page.getByText('Tu universo sigue aquí.')).toBeVisible()
  await context.close()
  const second = await browser.newPage()
  await enter(second)
  await second.locator('canvas').evaluate(canvas => canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })))
  await expect(second.getByRole('button', { name: 'Volver a intentar' })).toBeVisible()
  await second.close()
})
