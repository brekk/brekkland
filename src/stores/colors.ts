import { atom, batched } from "nanostores"
import { DEFAULT_PALETTE_RECORD, DEFAULT_PALETTE } from "#/utilities/color"
import colorable from "colorable"
import { pipe, nth, prop } from "ramda"
import type {
  HexContrast,
  CompactComparison,
  Accessibility,
} from "#/colorable.d.ts"

export const colorFg = atom<string>(DEFAULT_PALETTE_RECORD.fg)
export const $fg = colorFg
export const colorAccent = atom<string>(DEFAULT_PALETTE_RECORD.accent)
export const $accent = colorAccent
export const colorBg = atom<string>(DEFAULT_PALETTE_RECORD.bg)
export const $bg = colorBg

const compareColors = (a: string, b: string): Accessibility => {
  const [c] = colorable([a, b], { compact: true, threshold: 0 })
  return c.combinations[0].accessibility
}

export const $contrastFgBg = batched([$fg, $bg], compareColors)
export const $contrastFgAccent = batched([$fg, $accent], compareColors)
export const $contrastBgAccent = batched([$bg, $accent], compareColors)

export const colorPalette = atom<string>(DEFAULT_PALETTE)
export const $palette = colorPalette
export const colorModified = atom<boolean>(false)
export const $modified = colorModified
