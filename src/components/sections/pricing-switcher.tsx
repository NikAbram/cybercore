'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState, type KeyboardEvent } from 'react'

import { hourlyPricing, packagePricing, type PriceOption } from '@/data/pricing'

import styles from './landing-sections.module.css'

type PricingType = 'hourly' | 'packages'

const pricingSets: Record<
  PricingType,
  { label: string; title: string; options: readonly PriceOption[] }
> = {
  hourly: {
    label: 'По часам',
    title: 'Почасовые тарифы',
    options: hourlyPricing,
  },
  packages: {
    label: 'Пакеты',
    title: 'Пакеты',
    options: packagePricing,
  },
}

function PriceTable({
  title,
  options,
}: {
  title: string
  options: readonly PriceOption[]
}) {
  return (
    <div className={styles.priceGroup}>
      <h3>{title}</h3>
      <div className={styles.priceHeader} aria-hidden="true">
        <span>Тариф</span>
        <span className="font-display">STANDARD</span>
        <span className="font-display">VIP</span>
      </div>
      <div className={styles.priceRows}>
        {options.map((option) => (
          <article
            className={
              option.popular ? styles.priceRowPopular : styles.priceRow
            }
            key={option.name}
          >
            <div className={styles.priceName}>
              <h4>{option.name}</h4>
              <p>{option.period}</p>
              {option.popular ? <span>Частый выбор</span> : null}
            </div>
            <p className={`${styles.priceValue} font-display`}>
              <span className={styles.mobileZone}>STANDARD</span>
              {option.standard}
            </p>
            <p className={`${styles.priceValue} font-display`}>
              <span className={styles.mobileZone}>VIP</span>
              {option.vip}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}

export function PricingSwitcher() {
  const [activeType, setActiveType] = useState<PricingType>('hourly')
  const [toast, setToast] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()
  const activeSet = pricingSets[activeType]

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 1800)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const selectPricing = (type: PricingType) => {
    if (type === activeType) return
    setActiveType(type)
    setToast(
      type === 'hourly'
        ? 'Показаны почасовые тарифы'
        : 'Показаны пакетные тарифы',
    )
  }

  const moveTabFocus = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentType: PricingType,
  ) => {
    const tabOrder = Object.keys(pricingSets) as PricingType[]
    const currentIndex = tabOrder.indexOf(currentType)
    let nextIndex: number | null = null

    if (event.key === 'ArrowRight')
      nextIndex = (currentIndex + 1) % tabOrder.length
    if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabOrder.length) % tabOrder.length
    }
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = tabOrder.length - 1
    if (nextIndex === null) return

    event.preventDefault()
    const nextType = tabOrder[nextIndex]
    selectPricing(nextType)
    document.getElementById(`pricing-tab-${nextType}`)?.focus()
  }

  return (
    <>
      <div
        className={styles.pricingTabs}
        role="tablist"
        aria-label="Вид тарифа"
      >
        {(Object.keys(pricingSets) as PricingType[]).map((type) => (
          <button
            id={`pricing-tab-${type}`}
            className={styles.pricingTab}
            type="button"
            role="tab"
            aria-selected={activeType === type}
            aria-controls="pricing-panel"
            tabIndex={activeType === type ? 0 : -1}
            key={type}
            onClick={() => selectPricing(type)}
            onKeyDown={(event) => moveTabFocus(event, type)}
          >
            {pricingSets[type].label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          id="pricing-panel"
          key={activeType}
          className={styles.pricingPanel}
          role="tabpanel"
          aria-labelledby={`pricing-tab-${activeType}`}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
          <PriceTable title={activeSet.title} options={activeSet.options} />
        </motion.div>
      </AnimatePresence>

      <div className={styles.toastRegion} aria-live="polite" aria-atomic="true">
        <AnimatePresence>
          {toast ? (
            <motion.p
              className={styles.toast}
              role="status"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 6 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
            >
              {toast}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  )
}
