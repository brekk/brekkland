import { propOr, __ as $, pipe } from "ramda"

type ColorTrio = [string, string, string]

export const DEFAULT_PALETTE = "cypherpunk"
export const PALETTE: Record<string, ColorTrio> = {
  [DEFAULT_PALETTE]: ["#000", "#ecf832", "#fff"],
}

export const paletteToObject = ([fg, accent, bg]: ColorTrio) => ({
  fg,
  accent,
  bg,
})

export const getPalette = pipe(
  propOr(DEFAULT_PALETTE, $, PALETTE),
  paletteToObject,
)

export const DEFAULT_PALETTE_RECORD = getPalette(DEFAULT_PALETTE)
