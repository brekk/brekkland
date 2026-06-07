import { propOr, __, pipe } from "ramda"
// foreground, accent, background
type ColorTrio = [string, string, string]

const $ = {
  black: "#000",
  white: "#fff",
  mid: "#888",
  strongPink: "#de20a0",
  hotBrick: "#cf0015",
  hotMustard: "#ffc300",
  lellow: "#fffdb4",
  cream: "#fff4d2",
  bubbleGum: "#ff98cb",
  neonYellow: "#ecf832",
  puke: "#d5db98",
  olive: "#5b7b64",
  marine: "#2098ab",
  blueDork: "#342f51",
  darkness: "#2e2e35",
  offDark: "#23102c",
  megaDork: "#240260",
  purp: "#7624ab",
}

export const PALETTE: Record<string, ColorTrio> = {
  cypherpunk: [$.black, $.neonYellow, $.white],
  neonDevil: [$.hotMustard, $.hotBrick, $.darkness],
  armyGavy: [$.puke, $.megaDork, $.olive],
  nectarine: [$.offDark, $.strongPink, $.lellow],
  sorbet: [$.blueDork, $.bubbleGum, $.cream],
  blueDream: [$.darkness, $.cream, $.marine],
  agriculture: ["#215226", "#f3b600", "#b6ebae"],
  meline: ["#001f3a", "#c2e3e6", "#c46565"],
}

export const DEFAULT_PALETTE = "meline"

export const paletteToObject = ([fg, accent, bg]: ColorTrio) => ({
  fg,
  accent,
  bg,
})

export const getPalette = pipe(
  propOr(DEFAULT_PALETTE, __, PALETTE),
  paletteToObject,
)

export const DEFAULT_PALETTE_RECORD = getPalette(DEFAULT_PALETTE)
