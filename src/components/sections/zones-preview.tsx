import Image from 'next/image'

import { zoneMedia } from '@/data/media'

import styles from './zones-preview.module.css'

export function ZonesPreview() {
  return (
    <section
      id="zones"
      className={styles.section}
      aria-labelledby="zones-title"
    >
      <div className={styles.heading}>
        <h2 id="zones-title">Пространство под твой сценарий</h2>
        <p>
          От основного зала до отдельной командной комнаты — выбери нужный
          уровень приватности.
        </p>
      </div>

      <div className={styles.grid}>
        {zoneMedia.map((zone, index) => (
          <article className={styles.card} key={zone.id}>
            <div className={styles.imageFrame}>
              <Image
                src={zone.src}
                alt={zone.alt}
                fill
                loading="eager"
                sizes="(max-width: 767px) 100vw, 33vw"
                style={{ objectPosition: zone.focalPoint }}
                className={styles.image}
              />
            </div>
            <div className={styles.caption}>
              <h3 className="font-display">{zone.name}</h3>
              <p>{zone.description}</p>
              <span className="font-display" aria-hidden="true">
                0{index + 1}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
