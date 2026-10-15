import { z } from 'zod'

import { zones } from '@/data/zones'

import {
  BOOKING_DURATIONS,
  BOOKING_SEAT_COUNTS,
  normalizeRussianPhone,
  validateBookingDateTime,
} from './rules'

const zoneIds = zones.map(({ id }) => id) as [
  (typeof zones)[number]['id'],
  ...(typeof zones)[number]['id'][],
]

export const bookingSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Введите имя — минимум 2 символа.')
      .max(60, 'Имя должно быть не длиннее 60 символов.'),
    phone: z
      .string()
      .trim()
      .transform(normalizeRussianPhone)
      .pipe(
        z.string().regex(/^\+7\d{10}$/, 'Введите российский номер из 10 цифр.'),
      ),
    zone: z.enum(zoneIds, { error: 'Выберите игровую зону.' }),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Выберите дату.'),
    time: z
      .string()
      .regex(/^([01]\d|2[0-3]):(?:00|30)$/, 'Выберите время с шагом 30 минут.'),
    duration: z
      .number({ error: 'Выберите продолжительность.' })
      .refine(
        (value) => BOOKING_DURATIONS.includes(value),
        'Продолжительность — от 1 до 12 часов.',
      ),
    seats: z
      .number({ error: 'Выберите количество мест.' })
      .refine(
        (value) => BOOKING_SEAT_COUNTS.includes(value),
        'Количество мест — от 1 до 5.',
      ),
    consent: z
      .boolean()
      .refine(Boolean, 'Подтвердите согласие на обработку данных.'),
    website: z.string().max(0, 'Некорректная заявка.'),
  })
  .strict()
  .superRefine(({ date, time }, context) => {
    const message = validateBookingDateTime(date, time)
    if (!message) return

    context.addIssue({
      code: 'custom',
      message,
      path: ['date'],
    })
  })

export type BookingFormInput = z.input<typeof bookingSchema>
export type BookingRequest = z.output<typeof bookingSchema>
