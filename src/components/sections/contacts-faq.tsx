import { Clock3, MapPin } from 'lucide-react'

import { faqItems } from '@/data/faq'
import { site } from '@/data/site'

import styles from './landing-sections.module.css'

export function ContactsFaq() {
  return (
    <section
      id="contacts"
      className={`${styles.section} ${styles.contactsFaq}`}
      aria-labelledby="contacts-title"
    >
      <div className={styles.contacts}>
        <h2 id="contacts-title">Встретимся в игре</h2>
        <p className={styles.contactsLead}>
          CYBERCORE находится в Самаре. Точный адрес появится здесь после
          подтверждения площадки.
        </p>
        <dl className={styles.contactDetails}>
          <div>
            <MapPin aria-hidden="true" strokeWidth={1.5} />
            <dt>Город</dt>
            <dd>{site.city.value}</dd>
          </div>
          <div>
            <Clock3 aria-hidden="true" strokeWidth={1.5} />
            <dt>Режим работы</dt>
            <dd>{site.hours.value}</dd>
          </div>
        </dl>
        {site.mapUrl ? (
          <a href={site.mapUrl}>Построить маршрут</a>
        ) : (
          <p className={styles.contactNote}>
            Карта станет доступна после подтверждения адреса.
          </p>
        )}
      </div>

      <div className={styles.faq}>
        <h2>Ответы на вопросы</h2>
        <div>
          {faqItems.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
