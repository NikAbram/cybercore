import {
  hourlyPricing,
  packagePricing,
  pricingNote,
  type PriceOption,
} from '@/data/pricing'

import styles from './landing-sections.module.css'

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

export function Pricing() {
  return (
    <section
      id="pricing"
      className={`${styles.section} ${styles.pricing}`}
      aria-labelledby="pricing-title"
    >
      <header className={styles.sectionHeading}>
        <h2 id="pricing-title">Играй столько, сколько нужно</h2>
        <p>
          Почасовая оплата для короткой сессии и пакеты для длинной игры без
          скрытых условий.
        </p>
      </header>
      <PriceTable title="Почасовые тарифы" options={hourlyPricing} />
      <PriceTable title="Пакеты" options={packagePricing} />
      <p className={styles.pricingNote}>{pricingNote}</p>
    </section>
  )
}
