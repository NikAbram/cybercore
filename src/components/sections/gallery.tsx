import Image from 'next/image'

import { galleryMedia } from '@/data/media'

import styles from './landing-sections.module.css'

export function Gallery() {
  return (
    <section
      id="gallery"
      className={styles.section}
      aria-labelledby="gallery-title"
    >
      <header className={styles.sectionHeading}>
        <h2 id="gallery-title">Внутри CYBERCORE</h2>
        <p>
          Рабочие места, командная комната и зона отдыха собраны в единую
          спокойную среду.
        </p>
      </header>

      <div className={styles.galleryGrid}>
        {galleryMedia.map((asset, index) => (
          <figure className={styles.galleryItem} key={asset.src}>
            <Image
              src={asset.src}
              alt={asset.alt}
              fill
              sizes={
                index === 0 || index === 4
                  ? '(max-width: 767px) 100vw, 58vw'
                  : '(max-width: 767px) 100vw, 42vw'
              }
              style={{ objectPosition: asset.focalPoint }}
            />
          </figure>
        ))}
      </div>
    </section>
  )
}
