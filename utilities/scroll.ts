"use client"
import { curryN } from "ramda"

type Watcher = (entries: IntersectionObserverEntry[]) => void

export const watchWithOptions = curryN(
  2,
  (opts, uatu: Watcher) => new IntersectionObserver(uatu, opts),
)

export const watch = watchWithOptions({})
