import { atom } from "nanostores"

export type BrekklandGradient =
  | "gradient-trisquare"
  | "gradient-tritrisquare"
  | "gradient-techgrid"
  | "gradient-static"
  | "gradient-hex"

export const GRADIENT_RECORD = [
  "gradient-trisquare",
  "gradient-tritrisquare",
  "gradient-techgrid",
  "gradient-static",
  "gradient-hex",
]

export const $settingsVisible = atom<boolean>(false)
export const $settingsGradient = atom<BrekklandGradient>(
  "gradient-trisquare" as BrekklandGradient,
)
