'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { zones } from '@/data/zones'
import {
  bookingSchema,
  type BookingFormInput,
  type BookingRequest,
} from '@/lib/booking/schema'
import {
  BOOKING_DURATIONS,
  BOOKING_SEAT_COUNTS,
  getBookingDateBounds,
} from '@/lib/booking/rules'

import { BOOKING_OPEN_EVENT, type BookingOpenDetail } from './booking-events'
import styles from './booking-dialog.module.css'

type SubmissionState =
  { type: 'idle'; message: '' } | { type: 'error' | 'success'; message: string }

const initialValues: BookingFormInput = {
  name: '',
  phone: '',
  zone: 'standard',
  date: '',
  time: '',
  duration: 2,
  seats: 1,
  consent: false,
  website: '',
}

function FieldError({ message }: { message?: string }) {
  return message ? (
    <span className={styles.fieldError} role="alert">
      {message}
    </span>
  ) : null
}

export function BookingDialog({
  availability,
}: {
  availability: { enabled: boolean; privacyUrl: string | null }
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const previousOverflowRef = useRef('')
  const [submission, setSubmission] = useState<SubmissionState>({
    type: 'idle',
    message: '',
  })
  const dateBounds = getBookingDateBounds()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormInput, unknown, BookingRequest>({
    resolver: zodResolver(bookingSchema),
    defaultValues: initialValues,
    mode: 'onTouched',
  })

  useEffect(() => {
    const openDialog = (event: Event) => {
      const customEvent = event as CustomEvent<BookingOpenDetail>
      const dialog = dialogRef.current
      if (!dialog || dialog.open) return

      openerRef.current = document.activeElement as HTMLElement | null
      previousOverflowRef.current = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      setSubmission({ type: 'idle', message: '' })
      reset({
        ...initialValues,
        zone: customEvent.detail.zone ?? 'standard',
      })
      dialog.showModal()
    }

    window.addEventListener(BOOKING_OPEN_EVENT, openDialog)
    return () => window.removeEventListener(BOOKING_OPEN_EVENT, openDialog)
  }, [reset])

  useEffect(
    () => () => {
      document.body.style.overflow = previousOverflowRef.current
    },
    [],
  )

  const closeDialog = () => {
    const dialog = dialogRef.current
    if (dialog?.open) dialog.close()
  }

  const handleClose = () => {
    document.body.style.overflow = previousOverflowRef.current
    window.setTimeout(() => openerRef.current?.focus(), 0)
  }

  const submitBooking = async (values: BookingRequest) => {
    setSubmission({ type: 'idle', message: '' })

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const payload: unknown = await response.json().catch(() => null)
      const responseMessage =
        typeof payload === 'object' &&
        payload !== null &&
        'message' in payload &&
        typeof payload.message === 'string'
          ? payload.message
          : null

      if (!response.ok) {
        const fallback =
          response.status === 429
            ? 'Слишком много попыток. Подождите несколько минут и отправьте заявку снова.'
            : 'Не удалось отправить заявку. Попробуйте позже.'
        setSubmission({ type: 'error', message: responseMessage ?? fallback })
        return
      }

      setSubmission({
        type: 'success',
        message:
          responseMessage ??
          'Заявка отправлена. Мы свяжемся с вами для подтверждения бронирования.',
      })
      reset(initialValues)
    } catch {
      setSubmission({
        type: 'error',
        message:
          'Не удалось отправить заявку. Проверьте соединение и попробуйте позже.',
      })
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="booking-dialog-title"
      aria-describedby="booking-dialog-description"
      onClose={handleClose}
      onCancel={(event) => {
        event.preventDefault()
        closeDialog()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog()
      }}
    >
      <div className={styles.panel}>
        <button
          className={styles.close}
          type="button"
          aria-label="Закрыть форму"
          onClick={closeDialog}
        >
          <X aria-hidden="true" />
        </button>

        <header className={styles.heading}>
          <p className={`${styles.marker} font-display`}>CYBERCORE / REQUEST</p>
          <h2 id="booking-dialog-title">Заявка на игру</h2>
          <p id="booking-dialog-description">
            Укажите желаемое время. Администратор свяжется с вами и отдельно
            подтвердит доступность мест.
          </p>
        </header>

        {!availability.enabled ? (
          <div className={styles.unavailable} role="status">
            <p>Онлайн-заявки пока не принимаются.</p>
            <span>
              Мы откроем форму после настройки доставки, защиты запросов и
              утверждения политики обработки данных.
            </span>
          </div>
        ) : submission.type === 'success' ? (
          <div className={styles.success} role="status">
            <p>{submission.message}</p>
            <span>Заявка не резервирует место автоматически.</span>
            <button type="button" onClick={closeDialog}>
              Закрыть
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit(submitBooking)}>
            <div className={styles.field}>
              <label htmlFor="booking-name">Имя</label>
              <input
                id="booking-name"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? 'booking-name-error' : undefined
                }
                {...register('name')}
              />
              <span id="booking-name-error">
                <FieldError message={errors.name?.message} />
              </span>
            </div>

            <div className={styles.field}>
              <label htmlFor="booking-phone">Телефон</label>
              <input
                id="booking-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7 999 000-00-00"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={
                  errors.phone ? 'booking-phone-error' : undefined
                }
                {...register('phone')}
              />
              <span id="booking-phone-error">
                <FieldError message={errors.phone?.message} />
              </span>
            </div>

            <div className={`${styles.field} ${styles.fieldWide}`}>
              <label htmlFor="booking-zone">Игровая зона</label>
              <select
                id="booking-zone"
                aria-invalid={Boolean(errors.zone)}
                {...register('zone')}
              >
                {zones.map((zone) => (
                  <option value={zone.id} key={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
              <FieldError message={errors.zone?.message} />
            </div>

            <div className={styles.field}>
              <label htmlFor="booking-date">Дата</label>
              <input
                id="booking-date"
                type="date"
                min={dateBounds.min}
                max={dateBounds.max}
                suppressHydrationWarning
                aria-invalid={Boolean(errors.date)}
                aria-describedby={
                  errors.date ? 'booking-date-error' : undefined
                }
                {...register('date')}
              />
              <span id="booking-date-error">
                <FieldError message={errors.date?.message} />
              </span>
            </div>

            <div className={styles.field}>
              <label htmlFor="booking-time">Время</label>
              <input
                id="booking-time"
                type="time"
                step={1800}
                aria-invalid={Boolean(errors.time)}
                aria-describedby={
                  errors.time ? 'booking-time-error' : undefined
                }
                {...register('time')}
              />
              <span id="booking-time-error">
                <FieldError message={errors.time?.message} />
              </span>
            </div>

            <div className={styles.field}>
              <label htmlFor="booking-duration">Продолжительность</label>
              <select
                id="booking-duration"
                aria-invalid={Boolean(errors.duration)}
                {...register('duration', { valueAsNumber: true })}
              >
                {BOOKING_DURATIONS.map((duration) => (
                  <option value={duration} key={duration}>
                    {duration} ч
                  </option>
                ))}
              </select>
              <FieldError message={errors.duration?.message} />
            </div>

            <div className={styles.field}>
              <label htmlFor="booking-seats">Количество мест</label>
              <select
                id="booking-seats"
                aria-invalid={Boolean(errors.seats)}
                {...register('seats', { valueAsNumber: true })}
              >
                {BOOKING_SEAT_COUNTS.map((seats) => (
                  <option value={seats} key={seats}>
                    {seats}
                  </option>
                ))}
              </select>
              <FieldError message={errors.seats?.message} />
            </div>

            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="booking-website">Сайт</label>
              <input
                id="booking-website"
                tabIndex={-1}
                autoComplete="off"
                {...register('website')}
              />
            </div>

            <div className={`${styles.consent} ${styles.fieldWide}`}>
              <label>
                <input
                  type="checkbox"
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={
                    errors.consent ? 'booking-consent-error' : undefined
                  }
                  {...register('consent')}
                />
                <span>
                  Я согласен на обработку данных в соответствии с{' '}
                  <a href={availability.privacyUrl ?? undefined}>политикой</a>.
                </span>
              </label>
              <span id="booking-consent-error">
                <FieldError message={errors.consent?.message} />
              </span>
            </div>

            {submission.type === 'error' ? (
              <p
                className={`${styles.formMessage} ${styles.fieldWide}`}
                role="alert"
              >
                {submission.message}
              </p>
            ) : null}

            <div className={`${styles.submitRow} ${styles.fieldWide}`}>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Отправляем заявку…' : 'Отправить заявку'}
              </button>
              <p>Это запрос администратору, а не подтверждённая бронь.</p>
            </div>
          </form>
        )}
      </div>
    </dialog>
  )
}
