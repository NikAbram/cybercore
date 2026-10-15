import Image from 'next/image'

import { heroMedia } from '@/data/media'

import styles from './hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <p className={styles.location}>Самара / круглосуточно</p>
        <h1 id="hero-title" className={styles.title}>
          <span>Твоя игра.</span>
          <span>Твои правила.</span>
        </h1>
        <p className={styles.lead}>
          Мощные станции, честные 240+ Гц и пространство, в котором ничто не
          отвлекает от матча.
        </p>
        <a className={styles.action} href="#zones">
          Смотреть игровые зоны
        </a>
      </div>

      <div className={styles.visual}>
        <Image
          src={heroMedia.src}
          alt={heroMedia.alt}
          fill
          priority
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 58vw, 56vw"
          style={{ objectPosition: heroMedia.focalPoint }}
          className={styles.image}
        />
        <div className={styles.visualShade} aria-hidden="true" />
        <p className={styles.frameNote}>
          <span className="font-display">240+</span> Гц
        </p>
      </div>

      <div className={styles.route} aria-hidden="true">
        <span />
      </div>
    </section>
  )
}
