import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { BookingDialog } from './booking-dialog'
import { BookingTrigger } from './booking-trigger'

function renderBooking(enabled = true) {
  render(
    <>
      <BookingTrigger>Открыть форму</BookingTrigger>
      <BookingDialog
        availability={{
          enabled,
          privacyUrl: enabled ? 'https://example.com/privacy' : null,
        }}
      />
    </>,
  )
}

afterEach(() => {
  vi.restoreAllMocks()
  document.body.style.overflow = ''
})

describe('BookingDialog', () => {
  it('fails closed when booking is unavailable', async () => {
    const user = userEvent.setup()
    renderBooking(false)

    await user.click(screen.getByRole('button', { name: 'Открыть форму' }))

    expect(screen.getByRole('dialog', { name: 'Заявка на игру' })).toBeVisible()
    expect(screen.getByText('Онлайн-заявки пока не принимаются.')).toBeVisible()
    expect(
      screen.queryByRole('button', { name: 'Отправить заявку' }),
    ).not.toBeInTheDocument()
  })

  it('shows validation errors before a request can be sent', async () => {
    const user = userEvent.setup()
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('must not be called'))
    renderBooking()

    await user.click(screen.getByRole('button', { name: 'Открыть форму' }))
    await user.click(screen.getByRole('button', { name: 'Отправить заявку' }))

    expect(
      await screen.findByText('Введите имя — минимум 2 символа.'),
    ).toBeVisible()
    expect(
      screen.getByText('Введите российский номер из 10 цифр.'),
    ).toBeVisible()
    expect(
      screen.getByText('Подтвердите согласие на обработку данных.'),
    ).toBeVisible()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('handles native cancel and restores focus and scrolling', async () => {
    const user = userEvent.setup()
    renderBooking()
    const trigger = screen.getByRole('button', { name: 'Открыть форму' })

    await user.click(trigger)
    expect(document.body).toHaveStyle({ overflow: 'hidden' })
    const dialog = screen.getByRole('dialog', { name: 'Заявка на игру' })
    fireEvent(dialog, new Event('cancel', { cancelable: true }))

    expect(dialog).not.toHaveAttribute('open')
    expect(document.body).toHaveStyle({ overflow: '' })
    await vi.waitFor(() => expect(trigger).toHaveFocus())
  })
})
