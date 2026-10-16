import type { ContentStatus } from './site'

type PublishableStatus = Exclude<ContentStatus, 'missing'>

export type MediaAsset = {
  src: string
  alt: string
  focalPoint: string
  status: PublishableStatus
}

export const heroMedia = {
  src: '/images/cybercore/hero-main.webp',
  alt: 'Тёмный игровой зал с рядами компьютеров и направленным красным светом',
  focalPoint: '64% 50%',
  status: 'draft',
} satisfies MediaAsset

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
