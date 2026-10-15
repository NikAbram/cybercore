export type MediaAsset = {
  src: string
  alt: string
  focalPoint: string
  status: 'draft'
}

export const heroMedia = {
  src: '/images/cybercore/hero-main.webp',
  alt: 'Тёмный игровой зал с рядами компьютеров и направленным красным светом',
  focalPoint: '64% 50%',
  status: 'draft',
} satisfies MediaAsset

export const zoneMedia = [
  {
    id: 'standard',
    name: 'STANDARD',
    description: 'Основной зал для регулярной игры',
    src: '/images/cybercore/zone-standard.webp',
    alt: 'Ровный ряд игровых станций в основном зале',
    focalPoint: '58% 50%',
    status: 'draft',
  },
  {
    id: 'vip',
    name: 'VIP',
    description: 'Больше пространства и тише вокруг',
    src: '/images/cybercore/zone-vip.webp',
    alt: 'Просторная приватная игровая зона с мягким освещением',
    focalPoint: '66% 50%',
    status: 'draft',
  },
  {
    id: 'bootcamp',
    name: 'BOOTCAMP',
    description: 'Изолированная комната для команды',
    src: '/images/cybercore/zone-bootcamp.webp',
    alt: 'Командная игровая комната за стеклянной перегородкой',
    focalPoint: '52% 50%',
    status: 'draft',
  },
] as const

export const galleryMedia = [
  {
    src: '/images/cybercore/gallery-peripherals.webp',
    alt: 'Игровые мышь, клавиатура и гарнитура на столе',
    focalPoint: '62% 54%',
    status: 'draft',
  },
  {
    src: '/images/cybercore/gallery-main-hall.webp',
    alt: 'Общий вид просторного игрового зала',
    focalPoint: '50% 48%',
    status: 'draft',
  },
  {
    src: '/images/cybercore/gallery-lounge.webp',
    alt: 'Тихая зона отдыха с мягкими диванами',
    focalPoint: '58% 50%',
    status: 'draft',
  },
  {
    src: '/images/cybercore/gallery-team-room.webp',
    alt: 'Командная игровая комната за стеклом',
    focalPoint: '58% 48%',
    status: 'draft',
  },
  {
    src: '/images/cybercore/gallery-hardware.webp',
    alt: 'Компоненты игрового компьютера в чёрном корпусе',
    focalPoint: '62% 50%',
    status: 'draft',
  },
  {
    src: '/images/cybercore/gallery-seating.webp',
    alt: 'Эргономичное игровое кресло у рабочего места',
    focalPoint: '35% 50%',
    status: 'draft',
  },
] satisfies readonly MediaAsset[]
