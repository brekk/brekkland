import { atom } from "nanostores"

export type BrekklandGradient =
  | "gradient-trisquare"
  | "gradient-tritrisquare"
  | "gradient-techgrid"
  | "gradient-static"
  | "gradient-hex"
  | "gradient-lattice"

export const GRADIENT_RECORD = [
  "gradient-trisquare",
  "gradient-tritrisquare",
  "gradient-techgrid",
  "gradient-static",
  "gradient-hex",
  "gradient-lattice",
]
export const DEFAULT_GRADIENT = "gradient-lattice" as BrekklandGradient

export const $settingsVisible = atom<boolean>(false)
export const $settingsGradient = atom<BrekklandGradient>(DEFAULT_GRADIENT)
