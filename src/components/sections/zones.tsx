import Image from 'next/image'

import { BookingTrigger } from '@/components/booking/booking-trigger'
import { zones } from '@/data/zones'

import styles from './landing-sections.module.css'

export function Zones() {
  return (
    <section
      id="zones"
      className={styles.section}
      aria-labelledby="zones-title"
    >
      <header className={styles.sectionHeading}>
        <h2 id="zones-title">Пространство под твой сценарий</h2>
        <p>
          Три уровня приватности с понятным оснащением — от основного зала до
          отдельной командной комнаты.
        </p>
      </header>

      <div className={styles.zoneList}>
        {zones.map((zone) => (
          <article className={styles.zone} key={zone.id}>
            <div className={styles.zoneImage}>
              <Image
                src={zone.image.src}
                alt={zone.image.alt}
                fill
                sizes="(max-width: 767px) 100vw, 58vw"
                style={{ objectPosition: zone.image.focalPoint }}
              />
            </div>
            <div className={styles.zoneContent}>
              <div>
                <p className={`${styles.zoneName} font-display`}>{zone.name}</p>
                <h3>{zone.description}</h3>
              </div>
              <dl className={styles.specifications}>
                <div>
                  <dt>Мест</dt>
                  <dd className="font-display">{zone.capacity}</dd>
                </div>
                <div>
                  <dt>Процессор</dt>
                  <dd className="font-display">{zone.processor}</dd>
                </div>
                <div>
                  <dt>Видеокарта</dt>
                  <dd className="font-display">{zone.graphics}</dd>
                </div>
                <div>
                  <dt>Память / монитор</dt>
                  <dd className="font-display">
                    {zone.memory} / {zone.display}
                  </dd>
                </div>
              </dl>
              <p className={styles.zonePrice}>
                от <strong className="font-display">{zone.price}</strong>
                <span>{zone.priceUnit}</span>
              </p>
              <BookingTrigger className={styles.zoneAction} zone={zone.id}>
                Забронировать {zone.name}
              </BookingTrigger>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
