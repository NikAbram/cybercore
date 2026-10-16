import 'server-only'

const previewOrigin = new URL('https://cybercore.example')

function getConfiguredOrigin() {
  const value = process.env.SITE_URL?.trim()
  if (!value) return null

  try {
    const url = new URL(value)
    const isReservedHost =
      url.hostname === 'localhost' ||
      url.hostname.endsWith('.localhost') ||
      url.hostname.endsWith('.example')

    if (url.protocol !== 'https:' || isReservedHost) return null

    url.pathname = '/'
    url.search = ''
    url.hash = ''
    return url
  } catch {
    return null
  }
}

export function getPublicationConfig() {
  const configuredOrigin = getConfiguredOrigin()
  const isPublished =
    process.env.SITE_PUBLISHED === 'true' && configuredOrigin !== null

  return {
    isPublished,
    origin: configuredOrigin ?? previewOrigin,
  }
}
