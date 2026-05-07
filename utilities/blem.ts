const notEmpty = (x: string) => x !== ""

const isNonEmptyArray = (value: unknown): value is unknown[] =>
  Array.isArray(value) && value.length > 0

export type BlemModifier = string | string[]

export type BlemInstance = (e: string, m?: BlemModifier) => string
const box = (mods?: BlemModifier) => (typeof mods === "string" ? [mods] : mods)

const unwords = (x: string[]) => x.join(" ")
const append = (x: string) => (y: string) => x + y
const appendList =
  <T>(x: T) =>
  (lx: T[]) => [x, ...lx]
const el = append("__")
const element = (x: string) => (notEmpty(x) ? el(x) : ``)

export const blem =
  (base: string): BlemInstance =>
  (el: string, mods?: BlemModifier) => {
    const b = base + element(el)
    const joiner = appendList(b)
    const m = box(mods)
    return isNonEmptyArray(m)
      ? unwords(joiner(m.filter(notEmpty).map(append(b + "--"))))
      : b
  }

export default blem
