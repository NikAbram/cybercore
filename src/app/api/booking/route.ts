import { bookingSchema } from '@/lib/booking/schema'
import { getBookingServerConfig } from '@/lib/server/booking-config'
import { sendBookingEmail } from '@/lib/server/send-booking-email'

const MAX_BODY_BYTES = 8 * 1024

const messages = {
  invalid: 'Проверьте данные заявки и попробуйте ещё раз.',
  unavailable: 'Не удалось отправить заявку. Попробуйте позже.',
  success:
    'Заявка отправлена. Мы свяжемся с вами для подтверждения бронирования.',
} as const

function json(message: string, status: number) {
  return Response.json(
    { message },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) return json(messages.invalid, 413)

  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return json(messages.invalid, 415)
  }

  const config = getBookingServerConfig()
  if (!config) return json(messages.unavailable, 503)

  const origin = request.headers.get('origin')
  if (origin !== config.allowedOrigin) return json(messages.invalid, 403)

  let rawBody: string
  try {
    rawBody = await request.text()
  } catch {
    return json(messages.invalid, 400)
  }

  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return json(messages.invalid, 413)
  }

  let payload: unknown
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return json(messages.invalid, 400)
  }

  const parsed = bookingSchema.safeParse(payload)
  if (!parsed.success || parsed.data.website) {
    return json(messages.invalid, 400)
  }

  const delivered = await sendBookingEmail(parsed.data, config)
  if (!delivered) return json(messages.unavailable, 503)

  return json(messages.success, 200)
}
