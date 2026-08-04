/**
 * Renders the date this static page was last built (= last cron-triggered
 * rebuild). Since Next.js SSG evaluates RSCs at build time, new Date() here
 * returns the build timestamp — not the visitor's current time.
 *
 * Used on /whats-open-now as a canary: every daily rebuild updates the
 * "Status checked" date automatically without a manual reviewedOn edit.
 */
export function BuildDate() {
  const date = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    timeZone: 'America/New_York',
  })
  return <>{date}</>
}
