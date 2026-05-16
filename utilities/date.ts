import { curryN } from "ramda"
import { Temporal, Intl, toTemporalInstant } from "@js-temporal/polyfill"

// @ts-ignore
Date.prototype.toTemporalInstant = toTemporalInstant

export const toLocal = curryN(2, (tz: string, isoString: string) => {
  const instant = Temporal.Instant.from(isoString)
  const zdt = instant.toZonedDateTimeISO(tz)
  return zdt.toString()
})

export const toLocalFromDate = curryN(2, (timeZone: string, d: Date) => {
  return Temporal.Instant.from(d.toISOString())
    .toZonedDateTimeISO(timeZone)
    .toLocaleString()
})

export const hereDate = toLocalFromDate(
  Intl.DateTimeFormat().resolvedOptions().timeZone,
)
