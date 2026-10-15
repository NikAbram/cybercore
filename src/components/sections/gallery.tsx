import { GalleryGrid } from './gallery-grid'
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

      <GalleryGrid />
    </section>
  )
}
