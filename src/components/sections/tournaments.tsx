import { tournaments, tournamentsEmptyState } from '@/data/tournaments'

import styles from './landing-sections.module.css'

export function Tournaments() {
  return (
    <section className={styles.tournaments} aria-labelledby="tournaments-title">
      <header>
        <h2 id="tournaments-title">Турниры</h2>
        <p>Матчи, командные встречи и открытые сетки клуба.</p>
      </header>

      {tournaments.length === 0 ? (
        <div className={styles.tournamentEmpty}>
          <p className="font-display">MATCH PENDING</p>
          <h3>Расписание формируется</h3>
          <p>{tournamentsEmptyState}</p>
        </div>
      ) : (
        <div className={styles.tournamentList}>
          {tournaments.map((tournament) => (
            <article key={tournament.id}>
              <p>{tournament.date}</p>
              <h3>{tournament.title}</h3>
              <p>{tournament.game}</p>
              {tournament.registrationUrl ? (
                <a href={tournament.registrationUrl}>Зарегистрироваться</a>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
