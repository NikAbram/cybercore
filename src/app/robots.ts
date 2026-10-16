import type { MetadataRoute } from 'next'

import { getPublicationConfig } from '@/lib/server/publication-config'

export default function robots(): MetadataRoute.Robots {
  const publication = getPublicationConfig()

  if (!publication.isPublished) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: new URL('/sitemap.xml', publication.origin).toString(),
  }
}
