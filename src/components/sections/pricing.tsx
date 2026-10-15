import { pricingNote } from '@/data/pricing'

import styles from './landing-sections.module.css'
import { PricingSwitcher } from './pricing-switcher'

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
      <PricingSwitcher />
      <p className={styles.pricingNote}>{pricingNote}</p>
    </section>
  )
}
