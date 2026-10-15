export type Tournament = {
  id: string
  title: string
  date: string
  game: string
  registrationUrl: string | null
  status: 'confirmed' | 'draft'
}

export const tournaments: readonly Tournament[] = []

export const tournamentsEmptyState =
  'Скоро новые турниры. Анонсы появятся здесь после подтверждения расписания.'
