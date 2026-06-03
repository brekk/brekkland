import {
  __ as $,
  prepend,
  drop,
  map,
  split,
  isEmpty,
  cond,
  concat,
  always as K,
  anyPass,
  both,
  complement,
  curryN,
  defaultTo,
  either,
  endsWith,
  equals,
  find,
  identity as I,
  ifElse,
  includes,
  indexOf,
  length,
  pipe,
  prop,
  propEq,
  propOr,
  replace,
  slice,
  startsWith,
  toLower,
  toUpper,
  trim,
  tryCatch,
  when,
} from "ramda"

export const slug = (x: string): string =>
  pipe(
    toLower,
    replace(/[^a-z0-9\s-]/g, ""),
    replace(/\s+/g, "-"),
    replace(/-+/g, "-"),
    replace(/^-+|-+$/g, ""),
  )(x)

export const bisect = curryN(2, (x: number, str: string): [string, string] => [
  slice(0, x, str),
  slice(x + 1, length(str), str),
])

export const chop = curryN(2, (i: number, x: string): string =>
  x.slice(i, x.length),
)

export const trimLocal = (x: string): string =>
  when<string, string>(startsWith("./"), chop(2))(x)

export const collapse = replace($, "")
