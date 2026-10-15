'use client'

import type { ReactNode } from 'react'

import { BOOKING_OPEN_EVENT, type BookingOpenDetail } from './booking-events'

export function BookingTrigger({
  children,
  className,
  zone,
}: {
  children: ReactNode
  className?: string
  zone?: BookingOpenDetail['zone']
}) {
  return (
    <button
      className={className}
      type="button"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent<BookingOpenDetail>(BOOKING_OPEN_EVENT, {
            detail: { zone },
          }),
        )
      }
    >
      {children}
    </button>
  )
}
