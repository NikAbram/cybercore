export type ContentStatus = 'confirmed' | 'draft' | 'missing'

export type SiteDetail = {
  label: string
  value: string
  status: ContentStatus
}

export const navigation = [
  { label: 'Зоны', href: '#zones' },
  { label: 'Тарифы', href: '#pricing' },
  { label: 'Галерея', href: '#gallery' },
  { label: 'Контакты', href: '#contacts' },
] as const

export const advantages = [
  {
    title: 'Стабильный FPS',
    description:
      'Игровые сборки подобраны для соревновательных дисциплин и современных AAA-игр.',
  },
  {
    title: 'Мониторы от 240 Гц',
    description: 'Плавное изображение во всех игровых зонах.',
  },
  {
    title: 'Периферия турнирного класса',
    description: 'Механические клавиатуры, точные мыши и закрытые гарнитуры.',
  },
  {
    title: 'Пространство для игры',
    description:
      'Удобная посадка, климат-контроль и зоны разного уровня приватности.',
  },
] as const

export const site = {
  brand: 'CYBERCORE',
  city: { label: 'Город', value: 'Самара', status: 'draft' },
  address: {
    label: 'Адрес',
    value: 'Самара, проспект Киберспорта, 24',
    status: 'draft',
  },
  phone: {
    label: 'Телефон',
    value: '+7 (846) 000-24-24',
    status: 'draft',
  },
  email: {
    label: 'Email',
    value: 'booking@cybercore.example',
    status: 'draft',
  },
  hours: { label: 'Режим работы', value: 'Круглосуточно', status: 'draft' },
  timezone: {
    label: 'Часовой пояс',
    value: 'Europe/Samara (UTC+4)',
    status: 'draft',
  },
  mapUrl: null,
  socials: [],
} as const satisfies {
  brand: string
  city: SiteDetail
  address: SiteDetail
  phone: SiteDetail
  email: SiteDetail
  hours: SiteDetail
  timezone: SiteDetail
  mapUrl: string | null
  socials: readonly { label: string; href: string }[]
}
