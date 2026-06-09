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
  grayDay: [$.black, $.white, "#9096a2"],
  lemonade: ["#35322b", "#e579ad", "#ffdd00"],
  sunwater: ["#144357", "#75efff", "#ffdd00"],
  mintNomad: ["#232d46", "#b2ffa0", "#7fb174"],
  purpleDurp: ["#0b1c49", "#aba7ff", "#d296ca"],
  highlifer: ["#211ead", "#ffffff", "#f2ff00"],
  fakieThrowback: ["#370c5d", "#fffbd6", "#ffbf5e"],
  wiger: ["#101010", "#fffaeb", "#ffaf3f"],
}

export const DEFAULT_PALETTE = "wiger"

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
