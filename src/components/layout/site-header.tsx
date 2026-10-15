import Link from 'next/link'

import { navigation, site } from '@/data/site'

import styles from './site-layout.module.css'

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link
        className={`${styles.brand} font-display`}
        href="#top"
        aria-label={`${site.brand} — в начало страницы`}
      >
        {site.brand}
      </Link>
      <nav className={styles.navigation} aria-label="Основная навигация">
        <ul>
          {navigation.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <p className={styles.status}>
        <span aria-hidden="true" /> {site.hours.value}
      </p>
    </header>
  )
}
