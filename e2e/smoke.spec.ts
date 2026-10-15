import os from 'node:os'
import path from 'node:path'

import { expect, test } from '@playwright/test'

test('desktop journey: navigation, pricing, FAQ and gallery', async ({
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

  const navigation = page.getByRole('navigation', {
    name: 'Основная навигация',
  })
  await expect(navigation.getByRole('link')).toHaveCount(4)

  await navigation.getByRole('link', { name: 'Тарифы' }).click()
  await expect(page).toHaveURL(/#pricing$/)
  await expect
    .poll(() =>
      navigation
        .getByRole('link', { name: 'Тарифы' })
        .getAttribute('aria-current'),
    )
    .toBe('location')

  const packageTab = page.getByRole('tab', { name: 'Пакеты' })
  await packageTab.click()
  await expect(packageTab).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('heading', { name: 'Пакеты' })).toBeVisible()
  await expect(page.getByRole('status')).toHaveText('Показаны пакетные тарифы')

  await packageTab.press('ArrowLeft')
  const hourlyTab = page.getByRole('tab', { name: 'По часам' })
  await expect(hourlyTab).toBeFocused()
  await expect(hourlyTab).toHaveAttribute('aria-selected', 'true')

  const faqButton = page.getByRole('button', {
    name: 'Заявка на сайте сразу бронирует компьютер?',
  })
  await faqButton.scrollIntoViewIfNeeded()
  await faqButton.click()
  await expect(faqButton).toHaveAttribute('aria-expanded', 'true')
  await expect(
    page.getByText(
      /место считается забронированным только после подтверждения/,
    ),
  ).toBeVisible()

  const galleryTrigger = page.getByRole('button', {
    name: /Открыть изображение 1:/,
  })
  await galleryTrigger.scrollIntoViewIfNeeded()
  await galleryTrigger.click()

  const dialog = page.getByRole('dialog', { name: 'Просмотр галереи' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('1 / 6')).toBeVisible()
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe('hidden')

  await page.screenshot({
    path: path.join(os.tmpdir(), 'cybercore-stage4-lightbox.png'),
    fullPage: false,
  })

  await page.keyboard.press('ArrowRight')
  await expect(dialog.getByText('2 / 6')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(galleryTrigger).toBeFocused()
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe('')

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
    path: path.join(os.tmpdir(), 'cybercore-stage4-desktop.png'),
    fullPage: true,
  })
})

test('mobile menu is keyboard-safe and page has no horizontal overflow', async ({
  page,
}) => {
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
  const menuButton = page.getByRole('button', { name: /меню/ })
  await menuButton.click()
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
  await expect(
    page.getByRole('link', { name: 'Зоны', exact: true }).first(),
  ).toBeFocused()
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe('hidden')

  await page.screenshot({
    path: path.join(os.tmpdir(), 'cybercore-stage4-mobile-menu.png'),
    fullPage: false,
  })

  await page.keyboard.press('Escape')
  await expect(menuButton).toBeFocused()
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe('')

  await menuButton.click()
  await page
    .getByRole('navigation', { name: 'Основная навигация' })
    .getByRole('link', { name: 'Галерея' })
    .click()
  await expect(page).toHaveURL(/#gallery$/)
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
})

test('core interactions work with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#pricing')

  await page.getByRole('tab', { name: 'Пакеты' }).click()
  await expect(page.getByRole('heading', { name: 'Пакеты' })).toBeVisible()

  const firstQuestion = page.getByRole('button', {
    name: 'Нужно ли бронировать место заранее?',
  })
  await firstQuestion.click()
  await expect(firstQuestion).toHaveAttribute('aria-expanded', 'true')
})
