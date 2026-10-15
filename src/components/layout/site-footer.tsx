import { navigation, site } from '@/data/site'

import styles from './site-layout.module.css'

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerBrand}>
        <a className="font-display" href="#top">
          {site.brand}
        </a>
        <p>Игровое пространство для личных матчей и командных сессий.</p>
      </div>
      <nav aria-label="Навигация в подвале">
        <ul className={styles.footerNavigation}>
          {navigation.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.footerMeta}>
        <p>{site.city.value}</p>
        <p>{site.hours.value}</p>
        <p>© 2026 CYBERCORE</p>
      </div>
    </footer>
  )
}
