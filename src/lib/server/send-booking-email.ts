import 'server-only'

import { z } from 'zod'

import { zones } from '@/data/zones'
import type { BookingRequest } from '@/lib/booking/schema'

import type { getBookingServerConfig } from './booking-config'

type BookingServerConfig = NonNullable<
  ReturnType<typeof getBookingServerConfig>
>

const resendResponseSchema = z.object({ id: z.string().min(1) })
const zoneNames = new Map(zones.map((zone) => [zone.id, zone.name]))

export async function sendBookingEmail(
  booking: BookingRequest,
  config: BookingServerConfig,
) {
  const text = [
    'Новая заявка CYBERCORE',
    '',
    `Имя: ${booking.name}`,
    `Телефон: ${booking.phone}`,
    `Зона: ${zoneNames.get(booking.zone) ?? booking.zone}`,
    `Дата: ${booking.date}`,
    `Время: ${booking.time} (Europe/Samara)`,
    `Продолжительность: ${booking.duration} ч`,
    `Количество мест: ${booking.seats}`,
    '',
    'Заявка требует подтверждения администратором.',
  ].join('\n')

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `booking/${crypto.randomUUID()}`,
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        subject: 'Новая заявка на бронирование CYBERCORE',
        text,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
    })

    if (!response.ok) return false
    const payload: unknown = await response.json()
    return resendResponseSchema.safeParse(payload).success
  } catch {
    return false
  }
}
