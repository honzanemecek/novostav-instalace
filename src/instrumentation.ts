/**
 * Runs once when the production server starts, before it accepts requests.
 *
 * Initializing Payload here does two things at boot instead of on the first
 * request: it applies pending migrations (`prodMigrations` in payload.config.ts)
 * and starts the job queue cron (`jobs.autoRun`), which publishes scheduled
 * documents. If the database is unreachable or a migration fails, the server
 * does not start, and the container restarts until it can.
 *
 * Dev (`pnpm dev`) is left alone: Payload starts lazily there, as before.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if (process.env.NODE_ENV !== 'production') return
  if (process.env.NEXT_PHASE === 'phase-production-build') return

  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')

  await getPayload({ config, cron: true })
}
