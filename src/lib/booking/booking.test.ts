import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { bookingSchema } from './schema'
import {
  normalizeRussianPhone,
  parseSamaraDateTime,
  validateBookingDateTime,
} from './rules'

const now = new Date('2026-10-15T08:00:00.000Z')

beforeAll(() => {
  vi.useFakeTimers()
  vi.setSystemTime(now)
})

afterAll(() => vi.useRealTimers())

describe('booking rules', () => {
  it('normalizes common Russian phone formats', () => {
    expect(normalizeRussianPhone('8 (999) 123-45-67')).toBe('+79991234567')
    expect(normalizeRussianPhone('999 123 45 67')).toBe('+79991234567')
  })

  it('interprets club time in Europe/Samara', () => {
    expect(parseSamaraDateTime('2026-10-15', '13:30')?.toISOString()).toBe(
      '2026-10-15T09:30:00.000Z',
    )
  })

  it('rejects times outside the booking window', () => {
    expect(validateBookingDateTime('2026-10-15', '12:00', now)).toMatch(
      /через 30 минут/,
    )
    expect(validateBookingDateTime('2026-11-20', '12:00', now)).toMatch(
      /30 дней/,
    )
  })

  it('validates and normalizes a complete request', () => {
    const parsed = bookingSchema.safeParse({
      name: '  Алексей  ',
      phone: '8 999 123-45-67',
      zone: 'vip',
      date: '2026-10-16',
      time: '18:30',
      duration: 3,
      seats: 2,
      consent: true,
      website: '',
    })

    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.name).toBe('Алексей')
      expect(parsed.data.phone).toBe('+79991234567')
    }
  })

  it('rejects honeypot input and missing consent', () => {
    const parsed = bookingSchema.safeParse({
      name: 'Алексей',
      phone: '+79991234567',
      zone: 'standard',
      date: '2026-10-16',
      time: '18:30',
      duration: 2,
      seats: 1,
      consent: false,
      website: 'spam.example',
    })

    expect(parsed.success).toBe(false)
  })
})
