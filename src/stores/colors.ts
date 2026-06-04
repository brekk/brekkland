import { atom } from "nanostores"
import { DEFAULT_PALETTE_RECORD, DEFAULT_PALETTE } from "#/utilities/color"

export const colorFg = atom<string>(DEFAULT_PALETTE_RECORD.fg)
export const $fg = colorFg
export const colorAccent = atom<string>(DEFAULT_PALETTE_RECORD.accent)
export const $accent = colorAccent
export const colorBg = atom<string>(DEFAULT_PALETTE_RECORD.bg)
export const $bg = colorBg

export const colorPalette = atom<string>(DEFAULT_PALETTE)
export const $palette = colorPalette
export const colorModified = atom<boolean>(false)
export const $modified = colorModified
