import type { ContentStatus } from './site'

type PublishableStatus = Exclude<ContentStatus, 'missing'>

export type Zone = {
  id: 'standard' | 'vip' | 'bootcamp'
  name: 'STANDARD' | 'VIP' | 'BOOTCAMP'
  capacity: string
  processor: string
  graphics: string
  memory: string
  display: string
  description: string
  price: string
  priceUnit: string
  image: {
    src: string
    alt: string
    focalPoint: string
    status: PublishableStatus
  }
  status: PublishableStatus
}

export const zones = [
  {
    id: 'standard',
    name: 'STANDARD',
    capacity: '30 мест',
    processor: 'Ryzen 7 7800X3D',
    graphics: 'RTX 5070',
    memory: '32 ГБ',
    display: '240 Гц',
    description: 'Основной зал для регулярной игры',
    price: '250 ₽',
    priceUnit: 'за час',
    image: {
      src: '/images/cybercore/zone-standard.webp',
      alt: 'Ровный ряд игровых станций в основном зале',
      focalPoint: '58% 50%',
      status: 'draft',
    },
    status: 'draft',
  },
  {
    id: 'vip',
    name: 'VIP',
    capacity: '10 мест',
    processor: 'Ryzen 7 9800X3D',
    graphics: 'RTX 5080',
    memory: '32 ГБ',
    display: '360 Гц',
    description: 'Больше пространства и тише вокруг',
    price: '390 ₽',
    priceUnit: 'за час',
    image: {
      src: '/images/cybercore/zone-vip.webp',
      alt: 'Просторная приватная игровая зона с мягким освещением',
      focalPoint: '66% 50%',
      status: 'draft',
    },
    status: 'draft',
  },
  {
    id: 'bootcamp',
    name: 'BOOTCAMP',
    capacity: '5 мест',
    processor: 'Ryzen 7 9800X3D',
    graphics: 'RTX 5080',
    memory: '32 ГБ',
    display: '360 Гц',
    description: 'Изолированная комната для команды',
    price: '1 790 ₽',
    priceUnit: 'за комнату в час',
    image: {
      src: '/images/cybercore/zone-bootcamp.webp',
      alt: 'Командная игровая комната за стеклянной перегородкой',
      focalPoint: '52% 50%',
      status: 'draft',
    },
    status: 'draft',
  },
] as const satisfies readonly Zone[]
