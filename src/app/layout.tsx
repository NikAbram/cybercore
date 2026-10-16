import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import type { ReactNode } from 'react'

import { getPublicationConfig } from '@/lib/server/publication-config'

import './globals.css'

const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const publication = getPublicationConfig()

export const metadata: Metadata = {
  metadataBase: publication.origin,
  title: {
    default: 'CYBERCORE — компьютерный клуб в Самаре',
    template: '%s | CYBERCORE',
  },
  description:
    'Игровые зоны CYBERCORE для одиночной игры, встреч с друзьями и командных сессий.',
  applicationName: 'CYBERCORE',
  alternates: publication.isPublished
    ? { canonical: publication.origin }
    : undefined,
  robots: {
    index: publication.isPublished,
    follow: publication.isPublished,
    googleBot: {
      index: publication.isPublished,
      follow: publication.isPublished,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'CYBERCORE — пространство для игры',
    description:
      'Мощные станции, мониторы от 240 Гц и игровые зоны разного уровня приватности.',
    siteName: 'CYBERCORE',
    locale: 'ru_RU',
    type: 'website',
    url: publication.isPublished ? publication.origin : undefined,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'CYBERCORE — пространство для игры',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CYBERCORE — пространство для игры',
    description:
      'Мощные станции, мониторы от 240 Гц и игровые зоны разного уровня приватности.',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        {children}
      </body>
    </html>
  )
}
