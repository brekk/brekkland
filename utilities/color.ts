import { propOr, __ as $, pipe } from "ramda"

type ColorTrio = [string, string, string]

export const DEFAULT_PALETTE = "neonDevil"
export const PALETTE: Record<string, ColorTrio> = {
  cypherpunk: ["#000", "#ecf832", "#fff"],
  neonDevil: ["#ffc300", "#cf0015", "#2e2e35"],
  armyGavy: ["#d5db98", "#240260", "#5b7b64"],
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
