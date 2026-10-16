import type { MetadataRoute } from 'next'

import { getPublicationConfig } from '@/lib/server/publication-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const publication = getPublicationConfig()
  if (!publication.isPublished) return []

  return [
    {
      url: publication.origin.toString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
