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

test('booking dialog validates, handles delivery errors and confirms accepted email', async ({
  page,
}) => {
  let providerAccepts = false
  await page.route('**/api/booking', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    await route.fulfill({
      status: providerAccepts ? 200 : 503,
      contentType: 'application/json',
      body: JSON.stringify({
        message: providerAccepts
          ? 'Заявка отправлена. Мы свяжемся с вами для подтверждения бронирования.'
          : 'Не удалось отправить заявку. Попробуйте позже.',
      }),
    })
  })

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const bookingButton = page.getByRole('button', { name: 'Забронировать ПК' })
  await bookingButton.click()

  const dialog = page.getByRole('dialog', { name: 'Заявка на игру' })
  await expect(dialog).toBeVisible()
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe('hidden')

  await page.screenshot({
    path: path.join(os.tmpdir(), 'cybercore-stage5-booking-form.png'),
    fullPage: false,
  })

  const submitButton = dialog.locator('button[type="submit"]')
  await submitButton.click()
  await expect(
    dialog.getByText(/Введите имя — минимум 2 символа/),
  ).toBeVisible()
  await expect(dialog.getByText(/Введите российский номер/)).toBeVisible()

  const visitDate = new Date(Date.now() + 2 * 86_400_000)
    .toISOString()
    .slice(0, 10)
  await dialog.getByLabel('Имя').fill('Алексей')
  await dialog.getByLabel('Телефон').fill('8 999 123-45-67')
  await dialog.getByLabel('Игровая зона').selectOption('vip')
  await dialog.getByLabel('Дата').fill(visitDate)
  await dialog.getByLabel('Время').fill('18:30')
  await dialog.getByLabel('Продолжительность').selectOption('3')
  await dialog.getByLabel('Количество мест').selectOption('2')
  await dialog.getByRole('checkbox').check()

  await dialog.getByRole('button', { name: 'Отправить заявку' }).click()
  await expect(submitButton).toBeDisabled()
  await expect(submitButton).toHaveText('Отправляем заявку…')
  await expect(
    dialog.getByText('Не удалось отправить заявку. Попробуйте позже.'),
  ).toBeVisible()
  await expect(dialog.getByText(/Заявка отправлена/)).not.toBeVisible()

  providerAccepts = true
  await dialog.getByRole('button', { name: 'Отправить заявку' }).click()
  await expect(
    dialog.getByText(
      'Заявка отправлена. Мы свяжемся с вами для подтверждения бронирования.',
    ),
  ).toBeVisible()
  await expect(
    dialog.getByText('Заявка не резервирует место автоматически.'),
  ).toBeVisible()

  await page.screenshot({
    path: path.join(os.tmpdir(), 'cybercore-stage5-booking-success.png'),
    fullPage: false,
  })

  await dialog.getByRole('button', { name: 'Закрыть', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await expect(bookingButton).toBeFocused()
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe('')

  await page.setViewportSize({ width: 375, height: 812 })
  await bookingButton.click()
  await expect(dialog).toBeVisible()
  await expect
    .poll(() =>
      page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      })),
    )
    .toEqual({ client: 375, scroll: 375 })

  await page.screenshot({
    path: path.join(os.tmpdir(), 'cybercore-stage5-booking-mobile.png'),
    fullPage: false,
  })

  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(bookingButton).toBeFocused()
})
