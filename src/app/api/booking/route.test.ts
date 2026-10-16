import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getBookingServerConfig, sendBookingEmail } = vi.hoisted(() => ({
  getBookingServerConfig: vi.fn(),
  sendBookingEmail: vi.fn(),
}))

vi.mock('@/lib/server/booking-config', () => ({ getBookingServerConfig }))
vi.mock('@/lib/server/send-booking-email', () => ({ sendBookingEmail }))

import { POST } from './route'

function validPayload() {
  const tomorrow = new Date(Date.now() + 86_400_000)
  const date = tomorrow.toISOString().slice(0, 10)

  return {
    name: 'Алексей',
    phone: '+79991234567',
    zone: 'standard',
    date,
    time: '23:30',
    duration: 2,
    seats: 1,
    consent: true,
    website: '',
  }
}

function bookingRequest(body: unknown) {
  return new Request('http://localhost:3000/api/booking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:3000',
    },
    body: JSON.stringify(body),
  })
}

function rawBookingRequest(body: string, contentType = 'application/json') {
  return new Request('http://localhost:3000/api/booking', {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      Origin: 'http://localhost:3000',
    },
    body,
  })
}

describe('POST /api/booking', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getBookingServerConfig.mockReturnValue({
      apiKey: 'not-a-real-key',
      from: 'CYBERCORE <booking@example.com>',
      to: 'booking@example.com',
      allowedOrigin: 'http://localhost:3000',
      privacyUrl: 'https://example.com/privacy',
    })
  })

  it('fails closed when server configuration is incomplete', async () => {
    getBookingServerConfig.mockReturnValue(null)
    const response = await POST(bookingRequest(validPayload()))

    expect(response.status).toBe(503)
    expect(sendBookingEmail).not.toHaveBeenCalled()
  })

  it('rejects a request from another origin', async () => {
    const request = bookingRequest(validPayload())
    request.headers.set('origin', 'https://attacker.example')
    const response = await POST(request)

    expect(response.status).toBe(403)
    expect(sendBookingEmail).not.toHaveBeenCalled()
  })

  it('rejects invalid booking data before delivery', async () => {
    const response = await POST(
      bookingRequest({ ...validPayload(), phone: '123', seats: 9 }),
    )

    expect(response.status).toBe(400)
    expect(sendBookingEmail).not.toHaveBeenCalled()
  })

  it('rejects unsupported and malformed request bodies', async () => {
    const unsupported = await POST(
      rawBookingRequest('name=Alex', 'application/x-www-form-urlencoded'),
    )
    const malformed = await POST(rawBookingRequest('{'))

    expect(unsupported.status).toBe(415)
    expect(malformed.status).toBe(400)
    expect(sendBookingEmail).not.toHaveBeenCalled()
  })

  it('rejects oversized request bodies', async () => {
    const request = rawBookingRequest(
      JSON.stringify({ value: 'x'.repeat(9000) }),
    )
    const response = await POST(request)

    expect(response.status).toBe(413)
    expect(sendBookingEmail).not.toHaveBeenCalled()
  })

  it('returns success only after the provider accepts the email', async () => {
    sendBookingEmail.mockResolvedValue(true)
    const response = await POST(bookingRequest(validPayload()))
    const result = (await response.json()) as { message: string }

    expect(response.status).toBe(200)
    expect(result.message).toMatch(/Заявка отправлена/)
    expect(sendBookingEmail).toHaveBeenCalledOnce()
  })

  it('does not claim success when delivery fails', async () => {
    sendBookingEmail.mockResolvedValue(false)
    const response = await POST(bookingRequest(validPayload()))

    expect(response.status).toBe(503)
  })
})
