import canUseDOM from './canUseDOM'

/**
 * The site's public origin, e.g. `https://novostav-instalace.cz` (no trailing slash).
 * `NEXT_PUBLIC_SERVER_URL` is the only source. It is inlined at build time, so the
 * Docker image must be built with it (see deploy/docker-compose.yml).
 */
export const getServerSideURL = () => {
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}
