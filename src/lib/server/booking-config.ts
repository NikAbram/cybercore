import 'server-only'

import { z } from 'zod'

const safeText = z
  .string()
  .trim()
  .min(1)
  .max(200)
  .refine(
    (value) => !/[\r\n]/.test(value),
    'Значение не должно содержать переносы строк.',
  )

const emailFrom = safeText.refine((value) => {
  const bracketedAddress = /<([^<>]+)>$/.exec(value)?.[1]
  return z.email().safeParse(bracketedAddress ?? value).success
}, 'Укажите корректный адрес отправителя.')

const serverConfigSchema = z.object({
  apiKey: z.string().trim().min(1),
  from: emailFrom,
  to: z.email(),
  allowedOrigin: z.url(),
})

function getPrivacyUrl() {
  const value = process.env.BOOKING_PRIVACY_URL?.trim()
  if (!value) return null
  if (value.startsWith('/') && !value.startsWith('//')) return value

  const parsed = z.url().safeParse(value)
  if (!parsed.success) return null

  const url = new URL(parsed.data)
  return url.protocol === 'https:' ? url.toString() : null
}

export function getBookingAvailability() {
  const privacyUrl = getPrivacyUrl()
  const enabled = process.env.BOOKING_FORM_ENABLED === 'true'
  const rateLimitConfigured =
    process.env.BOOKING_RATE_LIMIT_CONFIGURED === 'true'
  const mailConfigured = Boolean(
    process.env.RESEND_API_KEY &&
    process.env.BOOKING_EMAIL_FROM &&
    process.env.BOOKING_EMAIL_TO &&
    process.env.APP_ORIGIN,
  )

  return {
    enabled:
      enabled && rateLimitConfigured && mailConfigured && Boolean(privacyUrl),
    privacyUrl,
  }
}

export function getBookingServerConfig() {
  const availability = getBookingAvailability()
  if (!availability.enabled || !availability.privacyUrl) return null

  const parsed = serverConfigSchema.safeParse({
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.BOOKING_EMAIL_FROM,
    to: process.env.BOOKING_EMAIL_TO,
    allowedOrigin: process.env.APP_ORIGIN,
  })

  if (!parsed.success) return null

  return {
    ...parsed.data,
    privacyUrl: availability.privacyUrl,
  }
}
