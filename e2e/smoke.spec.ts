import os from 'node:os'
import path from 'node:path'

import { expect, test } from '@playwright/test'

test('renders every landing section and follows working navigation', async ({
  page,
}) => {
  const browserMessages: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      browserMessages.push(message.text())
    }
  })

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  await expect(page).toHaveTitle(/CYBERCORE/)
  await expect(
    page.getByRole('heading', { name: 'Твоя игра. Твои правила.' }),
  ).toBeVisible()

  for (const heading of [
    'Стабильный FPS',
    'Пространство под твой сценарий',
    'Играй столько, сколько нужно',
    'Турниры',
    'Внутри CYBERCORE',
    'Встретимся в игре',
    'Ответы на вопросы',
  ]) {
    await expect(page.getByRole('heading', { name: heading })).toBeAttached()
  }

  const mainNavigation = page.getByRole('navigation', {
    name: 'Основная навигация',
  })
  const navigationLinks = mainNavigation.getByRole('link')
  await expect(navigationLinks).toHaveCount(4)

  for (const link of await navigationLinks.all()) {
    const href = await link.getAttribute('href')
    expect(href).toMatch(/^#[a-z-]+$/)
    expect(href).not.toBe('#')
  }

  await page.getByRole('link', { name: 'Смотреть тарифы' }).click()
  await expect(page).toHaveURL(/#pricing$/)
  await expect(
    page.getByRole('heading', { name: 'Почасовые тарифы' }),
  ).toBeVisible()

  const faqQuestion = page.getByText(
    'Заявка на сайте сразу бронирует компьютер?',
  )
  await faqQuestion.click()
  await expect(
    page.getByText(
      /место считается забронированным только после подтверждения/,
    ),
  ).toBeVisible()

  await expect
    .poll(() =>
      page.locator('img').evaluateAll(
        (images) =>
          images.filter((image) => {
            const element = image as HTMLImageElement
            return !element.complete || element.naturalWidth === 0
          }).length,
      ),
    )
    .toBe(0)

  expect(browserMessages).toEqual([])

  await page.screenshot({
    path: path.join(os.tmpdir(), 'cybercore-stage3-desktop.png'),
    fullPage: true,
  })
})

test('has no horizontal page overflow at control widths', async ({ page }) => {
  const widths = [320, 375, 768, 1024, 1440, 1920]

  await page.goto('/')

  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 })

    const pageWidth = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }))

    expect(pageWidth.scroll, `horizontal overflow at ${width}px`).toBe(
      pageWidth.client,
    )
  }

  await page.setViewportSize({ width: 375, height: 812 })

  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded()
    await expect(image).toHaveJSProperty('complete', true)
  }

  await expect
    .poll(() =>
      page.locator('img').evaluateAll(
        (images) =>
          images.filter((image) => {
            const element = image as HTMLImageElement
            return !element.complete || element.naturalWidth === 0
          }).length,
      ),
    )
    .toBe(0)

  await page.locator('#contacts').scrollIntoViewIfNeeded()

  await page.screenshot({
    path: path.join(os.tmpdir(), 'cybercore-stage3-mobile.png'),
    fullPage: true,
  })
})
