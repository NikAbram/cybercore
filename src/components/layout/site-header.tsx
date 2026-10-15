'use client'

import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { navigation, site } from '@/data/site'

import styles from './site-layout.module.css'

const sectionIds = navigation.map(({ href }) => href.slice(1))

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.1, 0.5] },
    )

    sectionIds.forEach((id) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstLinkRef.current?.focus()

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      requestAnimationFrame(() => menuButtonRef.current?.focus())
    }

    const desktopQuery = window.matchMedia('(min-width: 901px)')
    const closeOnDesktop = () => {
      if (desktopQuery.matches) setMenuOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    desktopQuery.addEventListener('change', closeOnDesktop)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
      desktopQuery.removeEventListener('change', closeOnDesktop)
    }
  }, [menuOpen])

  return (
    <header className={`${styles.header} ${menuOpen ? styles.headerOpen : ''}`}>
      <a className={`${styles.brand} font-display`} href="#top">
        {site.brand}
      </a>

      <button
        ref={menuButtonRef}
        className={styles.menuButton}
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      <nav
        id="main-navigation"
        className={styles.navigation}
        aria-label="Основная навигация"
      >
        <ul>
          {navigation.map((item, index) => {
            const isActive = activeSection === item.href.slice(1)

            return (
              <li key={item.href}>
                <a
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  aria-current={isActive ? 'location' : undefined}
                  data-active={isActive || undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <p className={styles.status}>
        <span aria-hidden="true" />
        Открыто круглосуточно
      </p>
    </header>
  )
}
