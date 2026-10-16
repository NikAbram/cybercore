import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { PricingSwitcher } from './pricing-switcher'

describe('PricingSwitcher', () => {
  it('switches tariff sets by click and announces the result', async () => {
    const user = userEvent.setup()
    render(<PricingSwitcher />)

    const packagesTab = screen.getByRole('tab', { name: 'Пакеты' })
    await user.click(packagesTab)

    expect(packagesTab).toHaveAttribute('aria-selected', 'true')
    expect(
      await screen.findByRole('heading', { level: 3, name: 'Пакеты' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(
      'Показаны пакетные тарифы',
    )
  })

  it('supports arrow-key tab navigation', async () => {
    const user = userEvent.setup()
    render(<PricingSwitcher />)

    const hourlyTab = screen.getByRole('tab', { name: 'По часам' })
    const packagesTab = screen.getByRole('tab', { name: 'Пакеты' })
    hourlyTab.focus()
    await user.keyboard('{ArrowRight}')

    expect(packagesTab).toHaveFocus()
    expect(packagesTab).toHaveAttribute('aria-selected', 'true')
  })
})
