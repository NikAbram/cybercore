import Link from 'next/link'

import { Hero } from '@/components/sections/hero'
import { ZonesPreview } from '@/components/sections/zones-preview'

export default function HomePage() {
  return (
    <div className="page-shell">
      <header className="site-header">
        <Link
          className="brand font-display"
          href="/"
          aria-label="CYBERCORE — главная"
        >
          CYBERCORE
        </Link>
        <p className="header-status">
          <span aria-hidden="true" /> Игровое пространство
        </p>
      </header>
      <main>
        <Hero />
        <ZonesPreview />
      </main>
    </div>
  )
}
