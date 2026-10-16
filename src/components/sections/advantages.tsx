import { Armchair, Cpu, Gauge, Headphones } from 'lucide-react'

import { advantages } from '@/data/site'

import styles from './landing-sections.module.css'

const icons = [Cpu, Gauge, Headphones, Armchair] as const

export function Advantages() {
  return (
    <section
      id="advantages"
      className={styles.advantages}
      aria-labelledby="advantages-title"
    >
      <h2 id="advantages-title" className="sr-only">
        Преимущества клуба
      </h2>
      <ul>
        {advantages.map((advantage, index) => {
          const Icon = icons[index]

          return (
            <li key={advantage.title}>
              <Icon aria-hidden="true" strokeWidth={1.5} />
              <div>
                <h3>{advantage.title}</h3>
                <p>{advantage.description}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
