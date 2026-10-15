export type PriceOption = {
  name: string
  standard: string
  vip: string
  period: string
  popular?: boolean
  status: 'draft'
}

export const hourlyPricing = [
  {
    name: 'Дневной',
    standard: '250 ₽/ч',
    vip: '390 ₽/ч',
    period: '09:00–18:00',
    status: 'draft',
  },
  {
    name: 'Вечерний',
    standard: '320 ₽/ч',
    vip: '470 ₽/ч',
    period: '18:00–00:00',
    status: 'draft',
  },
  {
    name: 'Ночной час',
    standard: '280 ₽/ч',
    vip: '420 ₽/ч',
    period: '00:00–09:00',
    status: 'draft',
  },
] as const satisfies readonly PriceOption[]

export const packagePricing = [
  {
    name: '3 часа',
    standard: '690 ₽',
    vip: '1 050 ₽',
    period: 'Три часа подряд, старт в любое время',
    status: 'draft',
  },
  {
    name: '5 часов',
    standard: '990 ₽',
    vip: '1 590 ₽',
    period: 'Пять часов подряд, старт в любое время',
    popular: true,
    status: 'draft',
  },
  {
    name: 'Ночь',
    standard: '1 290 ₽',
    vip: '1 890 ₽',
    period: '22:00–08:00',
    status: 'draft',
  },
] as const satisfies readonly PriceOption[]

export const pricingNote =
  'Цены указаны за одно место. BOOTCAMP оформляется отдельной заявкой на комнату.'
