import { atom } from "nanostores"

export type BrekklandGradient =
  | "gradient-trisquare"
  | "gradient-tritrisquare"
  | "gradient-techgrid"
  | "gradient-static"

export const GRADIENT_RECORD = [
  "gradient-trisquare",
  "gradient-tritrisquare",
  "gradient-techgrid",
  "gradient-static",
]

export const $settingsVisible = atom<boolean>(false)
export const $settingsGradient = atom<BrekklandGradient>(
  "gradient-trisquare" as BrekklandGradient,
)
