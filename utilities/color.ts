import { propOr, __ as $, pipe } from "ramda"

type ColorTrio = [string, string, string]

export const DEFAULT_PALETTE = "armyGavy"
export const PALETTE: Record<string, ColorTrio> = {
  cypherpunk: ["#000", "#ecf832", "#fff"],
  neonDevil: ["#ffc300", "#cf0015", "#2e2e35"],
  armyGavy: ["#cdb855", "#431e84", "#638d6f"],
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
