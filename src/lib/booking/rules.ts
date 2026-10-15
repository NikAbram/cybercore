export const BOOKING_TIME_ZONE = 'Europe/Samara'
export const BOOKING_UTC_OFFSET_HOURS = 4
export const BOOKING_MIN_NOTICE_MINUTES = 30
export const BOOKING_MAX_DAYS_AHEAD = 30
export const BOOKING_DURATIONS = Array.from(
  { length: 12 },
  (_, index) => index + 1,
)
export const BOOKING_SEAT_COUNTS = Array.from(
  { length: 5 },
  (_, index) => index + 1,
)

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

export function normalizeRussianPhone(value: string) {
  const digits = value.replace(/\D/g, '')

  if (
    digits.length === 11 &&
    (digits.startsWith('7') || digits.startsWith('8'))
  ) {
    return `+7${digits.slice(1)}`
  }

  if (digits.length === 10) return `+7${digits}`
  return value.trim()
}

export function parseSamaraDateTime(date: string, time: string) {
  const dateMatch = DATE_PATTERN.exec(date)
  const timeMatch = TIME_PATTERN.exec(time)
  if (!dateMatch || !timeMatch) return null

  const [, yearText, monthText, dayText] = dateMatch
  const [, hourText, minuteText] = timeMatch
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  const hour = Number(hourText)
  const minute = Number(minuteText)

  const calendarCheck = new Date(Date.UTC(year, month - 1, day))
  if (
    calendarCheck.getUTCFullYear() !== year ||
    calendarCheck.getUTCMonth() !== month - 1 ||
    calendarCheck.getUTCDate() !== day
  ) {
    return null
  }

  return new Date(
    Date.UTC(year, month - 1, day, hour - BOOKING_UTC_OFFSET_HOURS, minute),
  )
}

export function validateBookingDateTime(
  date: string,
  time: string,
  now = new Date(),
) {
  const start = parseSamaraDateTime(date, time)
  if (!start) return 'Укажите корректные дату и время.'

  const minute = Number(time.slice(3))
  if (minute % 30 !== 0) return 'Время начала должно быть с шагом 30 минут.'

  const earliest = new Date(now.getTime() + BOOKING_MIN_NOTICE_MINUTES * 60_000)
  if (start < earliest) {
    return 'Выберите время не раньше чем через 30 минут.'
  }

  const latest = new Date(now.getTime() + BOOKING_MAX_DAYS_AHEAD * 86_400_000)
  if (start > latest) return 'Выберите дату в пределах ближайших 30 дней.'

  return null
}

export function formatDateInSamara(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BOOKING_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  )
  return `${values.year}-${values.month}-${values.day}`
}

export function getBookingDateBounds(now = new Date()) {
  return {
    min: formatDateInSamara(now),
    max: formatDateInSamara(
      new Date(now.getTime() + BOOKING_MAX_DAYS_AHEAD * 86_400_000),
    ),
  }
}
