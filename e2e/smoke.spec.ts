import os from 'node:os'
import path from 'node:path'

import { expect, test } from '@playwright/test'

test('renders the stage-two visual system and follows the hero action', async ({
  page,
}) => {
  const browserMessages: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      browserMessages.push(message.text())
    }
  })

  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: 'Твоя игра. Твои правила.' }),
  ).toBeVisible()
  await expect(page.getByText('CYBERCORE')).toBeVisible()

  await page.getByRole('link', { name: 'Смотреть игровые зоны' }).click()
  await expect(page).toHaveURL(/#zones$/)
  await expect(
    page.getByRole('heading', { name: 'Пространство под твой сценарий' }),
  ).toBeVisible()
  expect(browserMessages).toEqual([])

  await page.screenshot({
    path: path.join(os.tmpdir(), 'cybercore-stage2-desktop.png'),
    fullPage: true,
  })
})

test('keeps the hero readable without horizontal overflow at 320px', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 760 })
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: 'Твоя игра. Твои правила.' }),
  ).toBeVisible()

  const pageWidth = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }))

  expect(pageWidth.scroll).toBe(pageWidth.client)

  await page.screenshot({
    path: path.join(os.tmpdir(), 'cybercore-stage2-mobile.png'),
    fullPage: true,
  })
})
