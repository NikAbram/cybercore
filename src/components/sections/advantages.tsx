import { Armchair, Cpu, Gauge, Headphones } from 'lucide-react'

import { advantages } from '@/data/site'

import styles from './landing-sections.module.css'

const icons = [Cpu, Gauge, Headphones, Armchair] as const

export function Advantages() {
  return (
    <section className={styles.advantages} aria-label="Преимущества клуба">
      <ul>
        {advantages.map((advantage, index) => {
          const Icon = icons[index]

          return (
            <li key={advantage.title}>
              <Icon aria-hidden="true" strokeWidth={1.5} />
              <div>
                <h2>{advantage.title}</h2>
                <p>{advantage.description}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
